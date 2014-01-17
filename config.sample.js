var config = { 
    user: {
        nick: 'Nickname',
        user: 'Username',
        real: 'John Smith',
        pass: ''
    },  
    server: {
        //addr: 'irc.efnet.net',
        // irc.choopa.net sometimes gives Illegal channel name for #alpha
        addr: 'irc.servercentral.net',
        port: 6667
    },  
    chans: ['#channel']
}

config['god'] = [ 
    'user@host.com'
]

config['admins'] = [ 
];

module.exports = config;
