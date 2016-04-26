var http = require('http');


var selectServer = function(){
  var NUMBER_OF_SERVER = 3; // m[1-3].hkgolden.com

  return Math.ceil(Math.random() * NUMBER_OF_SERVER);
}

var fetch = function(path, resolve, reject){

  // wrapping http.get
  var options = {
    headers: {
      'User-Agent': 'Mozilla/5.0', // without this server wouldn't allow
      'X-Forwarded-For': '0.0.0.0',  // naive ip faker? lol
      'HTTP_CLIENT_IP': '0.0.0.0' // naive ip faker 2? xd
    },
    host: `m${selectServer()}.hkgolden.com`,
    path: path
  };

  http.get(options, res => {
    var html = '';

    res.setEncoding('utf-8');
    res.on('data', (data) => {
      html += data;
    });

    res.on('end', () => {
      resolve(html);
    });

  }).on('error', reject);

}

function Fetcher(){
  // constructor for fetcher
}

Fetcher.prototype.fetch = function(path){
  // example path: "/viewTopics.aspx?..."
  return new Promise((resolve, reject) => {
    fetch(path, resolve, reject);
  });
};

module.exports = Fetcher;
