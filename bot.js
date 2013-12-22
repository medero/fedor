var net = require('net'),
    irc = {info:{}},
    config = require('./config'),
    messages = {};

config['user']['nick'] = 'Bratan';
config['user']['user'] = 'Bratan';

irc.socket = new net.Socket();

irc.socket.on('data', function(data)
{
    data = data.split('\n');
    for (var i = 0; i < data.length; i++)
    {
        console.log('RECV -', data[i]);
        if (data !== '')
        {
            irc.handle(data[i].slice(0, -1));
        }
    }
});

irc.socket.on('connect', function()
{
    console.log('Established connection, registering and shit...');

    irc.on(/^PING :(.+)$/i, function(info)
    {
        irc.raw('PONG :' + info[1]);
    });

    setTimeout(function() {
        irc.raw('NICK ' + config.user.nick);
        irc.raw('USER ' + config.user.user + ' 8 * :' + config.user.real);
        config.chans.forEach(function( value, index ) {
            irc.join( value )
        });
    }, 1000);
});

//handles incoming messages
irc.handle = function(data)
{
    var i, info;
    for (i = 0; i < irc.listeners.length; i++)
    {
        info = irc.listeners[i][0].exec(data);
        if (info)
        {
            irc.listeners[i][1](info, data);
            if (irc.listeners[i][2])
            {
                irc.listeners.splice(i, 1);
                i--;
            }
        }
    }
}

irc.listeners = [];
irc.on = function(regex, callback)
{
    irc.listeners.push([regex, callback, false])
}

irc.on_once = function(regex, callback)
{
    irc.listeners.push([regex, callback, true]);
}

irc.raw = function(data)
{
    irc.socket.write(data + '\r\n', 'ascii', function()
    {
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

var commands = ['PRIVMSG'];

commands.forEach(function( value, index ) {
    irc.on( new RegExp('^:([_a-zA-Z]+)!([^@]+)@([^ ]+) ' + value + ' #([a-z]+) :(.*)$' ), function( info, whatineed ) {

        messages.handle({
            nick: info[1],
            username: info[2],
            host: info[3],
            channel: '#' + info[4],
            message: info[5],
            handle: info[2]+'@'+info[3]
        })
        //messages.handle ( info )
    });
});

messages.listeners = [];
messages.handle = function( obj ) {
    var i, info;
    for (i = 0; i < messages.listeners.length; i++)
    {
        matches = messages.listeners[i][0].exec(obj['message']);
        if (matches)
        {
            messages.listeners[i][1](obj, matches);
            if (messages.listeners[i][2])
            {
                messages.listeners.splice(i, 1);
                i--;
            }
        }
    }
}
messages.watch = function(data, callback)
{
    messages.listeners.push([data, callback, false])
}

messages.watch(/^\.topic$/, function( info, matches ) {
    irc.raw('TOPIC ' + info['channel']);
});

messages.watch(/^\.topic (.+)/, function( info, matches ) {
    irc.raw('TOPIC ' + info['channel'] + ' :' + matches[1]);
});

messages.watch(/^\.op/, function( info ) {
    var hosts = config['god'].concat( config['admins'] );

    if ( hosts.indexOf( info['handle'] !== -1 ) ) {
        irc.raw('MODE ' + info['channel'] + ' +o ' + info['nick'] );
    }

});

// start the bot
irc.socket.setEncoding('ascii');
irc.socket.setNoDelay();
irc.socket.connect(config.server.port, config.server.addr);
