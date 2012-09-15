var Scheme = {};

Scheme.String = function(val) {
  this.type = 'STRING';
  this.val = val.substring(1, val.length -1);
};

Scheme.Identifier = function(val) {
  this.type = 'IDENTIFIER';
  this.val = val.toLowerCase();
};


Scheme.Number = function(val) {
  this.type = 'NUMBER';
  this.val = parseFloat(val);
};

module.exports = Scheme;
