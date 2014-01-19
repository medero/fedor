var net = require('net'),
    config = require('./config'),
    irc = {
          info:{}
        , listeners : []
        , socket : new net.Socket()
        , ops : config['god'].concat( config['admins'] )
    },
    names = ['AxeMurderer', 'KZombie', 'Minotauro', 'KrazyHorse'],
    name = names[Math.floor(Math.random()*names.length)],
    name = "Doflmingo",
    db = require('vendor/db/db'), 
    Youtube = require('./vendor/youtube/youtube'),
    youtube = new Youtube,
    Utils = require("./vendor/utils/utils"),
    utils = new Utils(), 
    linkRx = /(https?:[;\/?\\@&=+$,\[\]A-Za-z0-9\-_\.\!\~\*\'\(\)%][\;\/\?\:\@\&\=\+\$\,\[\]A-Za-z0-9\-_\.\!\~\*\'\(\)%#]*|[KZ]:\\*.*\w+)/g

config['user']['nick'] = name;
config['user']['user'] = name;

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
                        command: re.type,
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
                console.log(line);
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

        on( 'ping', /^PING :(.+)$/i, function ( message ) {
            console.log('sending ' + message.matches[1] );
            irc.raw('PONG :' + message.matches[1]);
        });

        setTimeout(function() {
            irc.raw('NICK ' + config.user.nick);
            irc.raw('USER ' + config.user.user + ' 8 * :' + config.user.real);
            config.chans.forEach(function( value, index ) {
                irc.join( value )
            });
        }, 1000);
    });

    irc.isOp = function( message ) {
        return irc.ops.indexOf( message.handle ) !== -1 || irc.ops.indexOf( message.handle.replace(/^~/, '') ) !== -1;

    };

    irc.handle = function( message ) {

        for (var i = 0, item; i < irc.listeners.length; i++) {

            item = irc.listeners[i];

            if ( message.command == item.command ) {
                switch ( message.command ) {

                    case 'privmsg':
                        var match = message.text.match( item.what )
                        if ( match ) {
                            message['matches'] = match;
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

    irc.say = function( channel, text ) {
        irc.raw('PRIVMSG ' + channel + ' :' + text );
    }

    irc.op = function( message ) {
        irc.raw('MODE ' + message.channel + ' +o ' + message.nick );
    }


    // custom events

    on( 'join', '#alpha', function( message ) {
        if ( irc.isOp( message ) )
            irc.op ( message )
    });

    on( 'msg', /^\.op/, function( message ) {

        if ( irc.isOp( message ) )
            irc.op ( message )
    });

    on( 'msg', /^\.topic$/, function( message ) {
        irc.raw( 'TOPIC ' + message.channel );
    });

    on( 'msg', /^\.topic (.+)/, function( message ) {
        irc.raw('TOPIC ' + message.channel + ' :' + message.matches[1] );
    });

    on( 'msg', /^(?:\.note\s*|`)([\w]+)/, function( message ) {
        db.model('Note').findOne({ key: message.matches[1] }, function( err, response ) { 
            if ( !err && response )
                irc.say( message.channel, response.value );
            else
                irc.say( message.channel, 'could not find key, sorry' )
        })
    });

    on( 'msg', /^(?:\+|\.addnote|\.setnote) ([\w]+) (.*)/, function(message) {
        var note = new db.Note({
            key: message.matches[1],
            value : message.matches[2]
        })

        note.save(function(err, arr){
            console.log(err)

            if ( arr ) {
                irc.say( message.channel, 'note saved.' )
            }
        })
    });

    on( 'msg', linkRx, function( message ) {
      utils.title( message.matches[0], function(results ) {
	  //if ( results.length ) irc.say( message.channel, '\u0002' + results )
	  if ( results.length ) irc.say( message.channel, results )

	  //message.say( results.length )
	  //message.say ( results )
	  for ( var i = results.length; i--; ) {
	      var code = results[i].charCodeAt();
	      if ( code > 255 ) {
		  //console.log('found')
		  //console.log( code )
		  //console.log( results[i].charCodeAt() )
	      }
	  }

      })
    });

    on( 'msg', /^\.y(?:o?u?)?t?(?:u?b?e)? ([^@]+)(?:\s*@\s*([-\[\]|_\w]+))?/, function(message) {
        youtube.search( message.matches[1], function(results) {
            if ( !results || results.length === 0  ) irc.say( message.channel, message.username + ": Sorry, no results for '" + message.matches[1] + "'")
            else irc.say( message.channel, message.username + ": " + results[0].title + " - " + results[0].player['default'])
        })
    })


    // start the bot
    irc.socket.setEncoding('ascii');
    irc.socket.setNoDelay();
    irc.socket.connect(config.server.port, config.server.addr);

})();
