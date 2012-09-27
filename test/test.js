var assert = require('assert')
var scheme = require('../lib/scheme');
var util = require('../lib/util');


function readEval(str, callback) {
  scheme.read(str, function(error, parsed) {

    assert.ifError(error);
    
    var evaled = scheme.eval(parsed);
    console.log('evaled', evaled);
    assert.ok(!util.isError(error));
    var formatted = util.format(evaled);
    console.log('Result:' + formatted);
    callback(formatted);
  });
}

describe('Scheme', function() {
  describe('eval()', function() {
    it('should return a number when a number is given', function(done) {
      readEval('1', function(result) {
        assert.equal('1', result);
        done();
      });
    });
    it('should wrap symbols in <>', function(done) {
      readEval('symbol', function(result) {
        assert.equal('<SYMBOL>', result);
        done();
      });
    });
  });
  describe('+', function() {
    it('should add two numbers', function(done) {
      readEval('(+ 1 2)', function(result) {
        assert.equal('3', result);
        done();
      });
    });
    it('should add multiple numbers', function(done) {
      readEval('(+ 3 3 3)', function(result) {
        assert.equal('9', result);
        done();
      });
    });
    it('should add in nested form', function(done) {
      readEval('(+ (+ 1 2) (+ 2 3))', function(result) {
        assert.equal('8', result);
        done();
      });

    });
  });
});

