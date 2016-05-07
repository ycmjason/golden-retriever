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

    // TopicBox_Details contains title, author, replyCount, rate
    var topics = $TopicBox_Details.map((i, t) => {
      /* Current hkg TopicBox_Details format
         <div class="TopicBox_Details">
           <a href="[URL]">
             <div class="TopicBox_Replies">
               [REPLY_COUNT]
             </div>
             <div>
               [TITLE]
             </div>
           </a>
           <div class="FloatsClearing"></div>
           <div class="TopicBox_Author">
           [AUTHOR]  - (XX: [RATE])
           <select class="TopicBox_PageSelect">
             <option value="0">Page...</option>
             <option value="1">Page 1</option>
             <option value="2">Page 2</option>
           </select>
           </div>
         </div>
       */
      // the link(<a>) contains number of replies and the title
      var $link = $(t).children('a');

      var url = $link.attr('href');

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
        rate: rate,
        url: url
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
