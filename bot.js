var net = require('net'),
    irc = {
          info:{}
        , listeners : []
        , socket : new net.Socket()
    },
    config = require('./config'),
    messages = {}
    rTree = {
    };

config['user']['nick'] = 'Shogun';
config['user']['user'] = 'Shogun';

function buildMessage( line ) {

    var baseMatch = '^:([_a-zA-Z]+)!([^@]+)@([^ ]+)',
        regex = [
            { 
                type: 'join',
                pattern: baseMatch + ' JOIN :#([a-z]+)' 
            },
            { 
                type: 'part',
                pattern: baseMatch + ' PART #([a-z]+)' 
            },
            { 
                type: 'privmsg', 
                pattern: baseMatch + ' PRIVMSG #([a-z]+) :(.*)' 
            },
            { 
                type: 'kick', 
                pattern: baseMatch + ' KICK #([a-z]+) ([a-z]+) :(.*)' 
            },
            {
                type: 'ping',
                pattern : /^PING :(.+)$/i
            }
        ];

        for ( var i = regex.length; i--; ) {

            var re = regex[i], match = line.match ( re.pattern );

            if ( match ) {

                if ( re.type == 'ping' ) {
                    return {
                        matches: match
                    }
                }

                var message = {
                    nick: match[1],
                    username: match[2],
                    host: match[3],
                    handle: match[2]+'@'+match[3],
                    command: re.type,
                    channel: '#' + match[4],

                    // optional
                    text: '',
                    kickedUser: ''
                }

                switch ( re.type ) {
                    case 'kick':
                        message['kickedUser'] = match[5]
                        message['text'] = match[6]
                    break;

                    case 'privmsg':
                        message['text'] = match[5]
                    break;
                }

                return message;
            }
        };

        return false;
};

(function() {

    irc.socket.on('data', function(data) {
        data = data.split(/\r\n/);
        for ( var i = 0, l = data.length, message; i < l; ++i ) {
            //console.log('RECV -', data[i]);
            if (data !== '') {
                line = data[i];
                //line = data[i].slice(0,-1);
                console.log('line: ' + line);
                message = buildMessage( line );

                if ( message ) {
                    irc.handle( message )
                    console.log( message );
                }

                //irc.handle(data[i].slice(0, -1));
            }
        }
    });

    irc.socket.on('connect', function() {
        console.log('Established connection, registering');

        /*
        irc.on(/^PING :(.+)$/i, function(info) {
            irc.raw('PONG :' + info[1]);
        });
        */

        on( 'ping', /^PING :(.+)$/i, function ( message ) {
            irc.raw('PONG : ' + message.matches[1]);
        });

        setTimeout(function() {
            irc.raw('NICK ' + config.user.nick);
            irc.raw('USER ' + config.user.user + ' 8 * :' + config.user.real);
            config.chans.forEach(function( value, index ) {
                irc.join( value )
            });
        }, 1000);
    });

    irc.handle = function( message ) {

        for (var i = 0, item; i < irc.listeners.length; i++) {

            item = irc.listeners[i];

            if ( message.command == item.command ) {
                switch ( message.command ) {
                    case 'privmsg':
                        if ( message.text.match( item.what ) ) {
                            item.callback.call( this, message )
                            if ( item.once )
                                irc.listeners.splice(i, 1);
                        }
                    break;

                    case 'join':
                        if ( message.channel == item.what ) {
                            item.callback.call( this, message )
                            if ( item.once )
                                irc.listeners.splice(i, 1);
                        }
                    break;
                    case 'ping':
                            item.callback.call( this, message )
                    break;
                }
            }
            
            /*
        irc.listeners.push({
            command: command,
            what: what,
            callback: callback,
            once: false
        })
        */

            /*
            info = irc.listeners[i][0].exec(data);
            if ( info ) {
                irc.listeners[i][1](info, data);
                if ( irc.listeners[i][2] ) {
                    irc.listeners.splice(i, 1);
                    i--;
                }
            }
            */
        }
    }

    function on( command, what, callback ) {

        if ( command == 'msg' ) command = 'privmsg';

        irc.listeners.push({
            command: command,
            what: what,
            callback: callback,
            once: false
        })
    }

    function on_once( command, what, callback ) {
        if ( command == 'msg' ) command = 'privmsg';

        irc.listeners.push({
            command: command,
            what: what,
            callback: callback,
            once: true
        })
    }

    irc.raw = function(data) {
        irc.socket.write(data + '\r\n', 'ascii', function() {
            console.log('SENT -', data);
        });
    }

    irc.join = function (chan, callback) {
        if (callback !== undefined) {
            irc.on_once(new RegExp('^:' + irc.info.nick + '![^@]+@[^ ]+ JOIN :' + chan), callback);
        }
        //irc.info.names[chan] = {};
        irc.raw('JOIN ' + chan);
    };

    //             /^:(?:nick[a-z])+!(?:username[^@]+)@(?:host[^ ]+) (?:command[^ ]+) #(?:channel[a-z]+) :(?:message.*)$/

    /* pseudocode
    on( 'msg', /^pride/i, function( message ) {
    });
    */

    on( 'join', '#alpha', function( message ) {
        //if ( message.user.isAdmin() ) {
            //irc.op( message.user, message.channel );
        //}

        irc.say( message.channel, 'sup goober' )

        var hosts = config['god'].concat( config['admins'] );
        if ( hosts.indexOf( message['handle'] !== -1 ) ) {
            irc.op( message.channel, message.nick );
        }
    });

    on( 'msg', /^\.op/, function( message ) {
        var hosts = config['god'].concat( config['admins'] );
        if ( hosts.indexOf( message['handle'] !== -1 ) ) {
            irc.op( message.channel, message.nick );
        }
    });

    on( 'msg', /foo/, function( message ) {
        irc.say( message.channel, 'what' )
    });

    irc.say = function( channel, message ) {
        irc.raw('PRIVMSG ' + channel + ' ' + message );
    }

    /*
    messages.watch(/^\.topic$/, function( info, matches ) {
        irc.raw('TOPIC ' + info['channel']);
    });

    messages.watch(/^\.topic (.+)/, function( info, matches ) {
        irc.raw('TOPIC ' + info['channel'] + ' :' + matches[1]);
    });

    messages.watch(/^\.op/, function( info ) {

        if ( hosts.indexOf( info['handle'] !== -1 ) ) {
            irc.op( info['channel'], info['nick'] );
        }

    });
    */

    irc.op = function( channel, nick ) {
        irc.raw('MODE ' + channel + ' +o ' + nick );
    }

    // start the bot
    irc.socket.setEncoding('ascii');
    irc.socket.setNoDelay();
    irc.socket.connect(config.server.port, config.server.addr);

})();
