var cheerio = require('cheerio');

var parse = {
  channels: function($){
    var $MainBoxLinks = $('.MainBoxLink');
    var urls = $MainBoxLinks.map((i, tag) => $(tag).attr('href'));
    var codes = urls.map((i, url) => url.match(/type=(.*)/)[1]);
    var names = $MainBoxLinks.children('div').map((i, tag) => $(tag).text());

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
  },
  topics: function($){
    var $TopicBox = $('.TopicBox, .TopicBox2');
    var $TopicBox_Details = $TopicBox.children('.TopicBox_Details');
    var topics = $TopicBox_Details.map((i, t) => {
      // the link(<a>) contains number of replies and the title
      var $link = $(t).children('a');
      var replyCount = $link.children('.TopicBox_Replies').remove().text().trim();

      var title = $link.children().text().trim();

      // [username]  - (RATE: [rate])
      // use /..-./ instead of /  - / because hkg use some weird space character
      var $author = $(t).children('.TopicBox_Author');
      $author.children('select').remove();
      var authorBoxMatched = $author.text().trim().match(/(.*)..-.\(.*: (.*)\)/);
      var author = authorBoxMatched[1];
      var rate = authorBoxMatched[2];

      return {
        title: title,
        author: author,
        replyCount: replyCount,
        rate: rate
      };
    });

    return topics;
  }
};



function Parser() {
  // Parser constructor
}
Parser.prototype.parse = function(what, html){
  var $ = cheerio.load(html);
  return parse[what]($);
}


module.exports = Parser;
