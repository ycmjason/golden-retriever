var sinon = require('sinon');
var assert = require('assert');

var hkgolden = require('../scraper');

describe('#getChannels', function(){

  describe('using mock fetcher', function(){

    before(function(){
      sinon.spy(hkgolden.fetcher, "fetch");
    });

    after(function(){
      // restore fetch from spy
      hkgolden.fetcher.fetch.restore(); 
    });

    it('should call fetcher.fetch is called once', function(){
      hkgolden.getChannels();
      
      // only one fetch would be needed for channels
      assert(hkgolden.fetcher.fetch.calledOnce);
    });

  });

  describe('using real fetcher', function(){
    it('should send get some channels from hkgolden', function(){

      var hasChannel = function(channels, code){
        return channels.map(channel => channel.code).indexOf(code) > -1;
      }

      // check for the 2 most important channels: Blow water(BW) and Adult(AU)
      assert(hasChannel(hkgolden.getChannels(), 'BW'));
      assert(hasChannel(hkgolden.getChannels(), 'AU'));

    });
  });

});
