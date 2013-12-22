var net = require('net'),
    irc = {}, config;

config = {
    user: {
        nick: 'Bratan',
        user: '',
        real: '',
        pass: ''
    },
    server: {
        addr: 'irc.efnet.net',
        port: 6667
    },
    chans: ['#test']
}

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
    setTimeout(function()
    {
        irc.raw('NICK ' + config.user.nick);
        irc.raw('USER ' + config.user.user + ' 8 * :' + config.user.real);
        setTimeout(function()
        {
            for (var i = 0; i < config.chans.length; i++)
            {
                irc.join(config.chans[i]);
            }
        }, 2000);
    }, 1000);
});

irc.socket.setEncoding('ascii');
irc.socket.setNoDelay();
irc.socket.connect(config.server.port, config.server.addr);

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
            }
        }
    }
}

irc.listeners = [];
irc.on = function(data, callback)
{
    irc.listeners.push([data, callback, false])
}
irc.on_once = function(data, callback)
{
    irc.listeners.push([data, callback, true]);
}

irc.raw = function(data)
{
    irc.socket.write(data + '\n', 'ascii', function()
    {
        console.log('SENT -', data);
    });
}
