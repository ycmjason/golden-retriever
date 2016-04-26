var cheerio = require('cheerio');

function Parser() {
  // Parser constructor
}

Parser.prototype.parseChannels = function(html){
  var $ = cheerio.load(html);

  var MainBoxLinks = $('.MainBoxLink');
  var urls = MainBoxLinks.map((i, tag) => $(tag).attr('href'));
  var codes = urls.map((i, url) => url.match(/type=(.*)/)[1]);
  var names = MainBoxLinks.children('div').map((i, tag) => $(tag).html());

  if(urls.length != codes.length || names.length != codes.length)
    throw new Error("Unexpected error in parsing channels. Length mismatch.");
  
  var channels = [];
  for(var i = 0; i < urls.length; i++){
    var channel = {
      code: codes[i],
      url : urls[i],
      name: names[i]
    };
    channels.push(channel);
  }

  return channels;
}

module.exports = Parser;
