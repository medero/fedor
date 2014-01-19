/* ------------------------------ Includes && Options ------------------------------ */
var exec = require('child_process').exec;

/* ------------------------------ Google ------------------------------ */
function Youtube() {

    //http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json
    //http://gdata.youtube.com/feeds/api/videos?q=god&alt=jsonc&v=2&max-results=2


    var self = this, apiKey = 'AI39si5RgZpzXXSZqrllt4uWNqrByoGF5pfT2zfEdjSB7C9voJjs7KA7qu6jtFaIo0hnGoZPz0zoLY2DdI_wscvXLjpooTqiKA';

  this.search = function(query, hollaback) {
    exec("curl -e 'http://medero.org' 'http://gdata.youtube.com/feeds/api/videos?q=" + escape(query) + "&alt=jsonc&v=2&max-results=1&key=" + apiKey + "'", function (err, stdout, stderr) {
      hollaback.call(this, JSON.parse(stdout)["data"]["items"]);
    }); 
  };  

}

/* ------------------------------ Export ------------------------------ */
module.exports = Youtube;

