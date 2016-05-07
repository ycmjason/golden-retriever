var http = require('http');

var selectServer = function(){
  var NUMBER_OF_SERVER = 3; // m[1-3].hkgolden.com

  return Math.ceil(Math.random() * NUMBER_OF_SERVER);
}

var fetch = function(host, path, resolve, reject){

  // wrapping http.get
  var options = {
    headers: {
      'User-Agent': 'Mozilla/5.0', // without this server wouldn't allow
      'X-Forwarded-For': '0.0.0.0',  // naive ip faker? lol
      'HTTP_CLIENT_IP': '0.0.0.0' // naive ip faker 2? xd
    },
    host: host,
    path: path
  };

  http.get(options, res => {
    var html = '';

    res.setEncoding('utf-8');

    // when recieve data chunk
    res.on('data', (data) => {
      html += data;
    });

    // when all data is recieved
    res.on('end', () => {
      resolve(html);
    });

  }).on('error', reject);

}

// constructor
function Fetcher() { }
Fetcher.prototype.fetch = function(path){
  // example path: "/viewTopics.aspx?..."
  return new Promise((resolve, reject) => {
    fetch(`m${selectServer()}.hkgolden.com`, path, resolve, reject);
  });
};

module.exports = Fetcher;
