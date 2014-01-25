function Parser() {

    this.buildMessage = function ( line ) {

        var baseMatch = '^:([_a-zA-Z|^]+)!([^@]+)@([^ ]+)',
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

    linkRx = /(https?:[;\/?\\@&=+$,\[\]A-Za-z0-9\-_\.\!\~\*\'\(\)%][\;\/\?\:\@\&\=\+\$\,\[\]A-Za-z0-9\-_\.\!\~\*\'\(\)%#]*|[KZ]:\\*.*\w+)/g;

}

module.exports = Parser;
