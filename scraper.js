var Fetcher = require('./lib/Fetcher'),
    Parser  = require('./lib/Parser');


function HKGolden(){
  this.fetcher = new Fetcher();
  this.parser  = new Parser();
}

HKGolden.prototype.getChannels = function(){
  return new Promise((resolve, reject) => {
    this.fetcher.fetch('/')
      .then(html => {
        var channels = this.parser.parse('channels', html);
        resolve(channels);
      })
      .catch(reject);
  });
};

HKGolden.prototype.getTopics = function(channelCode){
  if(!channelCode) throw new Error("No channel code given");

  return new Promise((resolve, reject) => {
    this.fetcher.fetch('/topics.aspx?type=' + channelCode)
      .then(html => {
        var topics = this.parser.parse('topics', html);
        resolve(topics);
      })
      .catch(reject);
  });
};

module.exports = HKGolden;
