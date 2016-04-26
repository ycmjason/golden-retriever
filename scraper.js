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
        var channels = this.parser.parseChannels(html);
        resolve(channels);
      })
      .catch(reject);
  });
}

module.exports = HKGolden;
