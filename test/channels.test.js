var sinon = require('sinon');
var assert = require('assert');

var HKGolden = require('../scraper');

/* test for getChannels */
describe('#getChannels', function(){

  describe('using mock fetcher', function(){

    it('should call fetcher.fetch once', function(){
      var hkgolden = new HKGolden();

      // use mock fetcher/parser
      var fetcher_mock = sinon.mock(hkgolden.fetcher);

      // only one fetch would be needed for channels
      fetcher_mock.expects("fetch").once().throws();

      try{
        hkgolden.getChannels();
      }catch(e) { }
      
      fetcher_mock.verify();
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



/* test for getTopics */
describe('#getTopics', function(){

  describe('using mock fetcher', function(){

    it('should call fetcher.fetch is called once', function(){
      var hkgolden = new HKGolden();

      // use mock fetcher
      var mock = sinon.mock(hkgolden.fetcher);

      // only one fetch would be needed for channels
      mock.expects("fetch").once().throws();

      try{
        hkgolden.getTopics('BW');
      }catch(e) { }
      
      mock.verify();
    });

  });

  describe('using real fetcher', function(){
    // hkg server so slow, let the tests has 7s timeout
    this.timeout(7000);

    it('should grap some real topics', function(){
      var hkgolden = new HKGolden();

      return hkgolden.getTopics('BW').then(topics => {
        //expecting number of tpics is 30
        assert(topics.length == 30);
      });

    });
  });

});




/* test for getTopic */
describe('#getTopic', function(){

  describe('using mock fetcher', function(){

    it('should call fetcher.fetch is called once', function(){
      var hkgolden = new HKGolden();

      // use mock fetcher
      var mock = sinon.mock(hkgolden.fetcher);

      // only one fetch would be needed for channels
      mock.expects("fetch").once().throws();

      try{
        hkgolden.getTopic(1234);
      }catch(e) { }
      
      mock.verify();
    });

  });

  describe('using real fetcher', function(){
    // hkg server so slow, let the tests has 7s timeout
    this.timeout(7000);

    it('should grap some real topics', function(){
      var hkgolden = new HKGolden();

      return hkgolden.getTopic(6366743).then(topic => {
        // replies include the post content itself
        assert.equal(topic.title, "[取暖台] 最近幾個月分手的你而家點? (46)");
        assert.deepEqual(topic.replies[0], {
          author: {
            name: "岸郊野",
            gender: "M"
          },
          createdDate: new Date('5/5/2016 22:54')
        });

        // see if certain expected content exists
        assert(topic.replies[0].body.search(/一介不取(.|\n)*驅寒送暖/) > -1);
      });

    });
  });

});
