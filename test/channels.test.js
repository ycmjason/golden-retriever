var sinon = require('sinon');
var assert = require('assert');

var HKGolden = require('../scraper');

describe('#getChannels', function(){

  describe('using mock fetcher', function(){

    it('should call fetcher.fetch is called once', function(){
      var hkgolden = new HKGolden();

      // use mock fetcher
      var mock = sinon.mock(hkgolden.fetcher);

      // only one fetch would be needed for channels
      mock.expects("fetch").once().throws();

      try{
        hkgolden.getChannels();
      }catch(e) { }
      
      mock.verify();
    });

  });

  describe('using real fetcher', function(){
    // hkg server so slow, let the tests has 7s timeout
    this.timeout(7000);

    it('should send get some channels from hkgolden', function(){

      var hasChannel = function(channels, code){
        return channels.map(channel => channel.code).indexOf(code) > -1;
      }

      var hkgolden = new HKGolden();

      // check for the 2 most important channels: Blow water(BW) and Adult(AU)
      // mocha will get the promise and check for errors:
      // Working with promise: https://mochajs.org/
      return hkgolden.getChannels().then(channels => {
        assert(hasChannel(channels, 'BW'));
        assert(hasChannel(channels, 'AU'));
      });

    });
  });

});
