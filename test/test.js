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
      readEval('val', function(result) {
        assert.equal('Error: Symbol "VAL" not defined.', result);
        done();
      });
    });
  });
  describe('define', function() {
    it('should return nothing on define', function(done) {
      readEval('(define x 3)', function(result) {
        assert.equal('', result);
        done(); 
      });
    });
    it('should return on previously defined symbol', function(done) {
      readEval('x', function(result) {
        assert.equal('3', result);
        done();
      });
    });
    it('should be able to operate on defined symbols', function(done) {
      readEval('(+ 1 x)', function(result) {
        assert.equal('4', result);
        done();
      });
    });
  });
  describe('lambda', function() {
    it('should be created freely', function(done) {
      readEval('(lambda (x) (+ 1 x))', function(result) {
        assert.equal('Function', result);
        done();
      });
    });
    it('should be definable', function(done) {
      readEval('(define plus (lambda (x) (+ 1 x)))', function(result) {
        assert.equal('', result);
        done();
      });
    });
    it('should be usable', function(done) {
      readEval('(plus 3)', function (result) {
        assert.equal('4', result);
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

