var Scheme = {};

Scheme.Types = {};
Scheme.Special = {};

Scheme.Special.Lambda = 'LAMBDA';
Scheme.Special.Define = 'DEFINE';
Scheme.Special.Conditional = 'IF';

var Types = Scheme.Types;
Types.Symbol = 'SYMBOL';
Types.String = 'STRING';
Types.Number = 'NUMBER';
Types.Null = 'NULL';
Types.Cons = 'CONS';
Types.Function = 'FUNCTION';

Scheme.Function = function(fun) {
  this.type = Types.Function;
  this.val = fun;
};

Scheme.String = function(val) {
  this.type = Types.String;
  this.val = val.substring(1, val.length -1);
};

Scheme.Symbol = function(val) {
  this.type = Types.Symbol;
  this.val = val.toUpperCase();
};


Scheme.Number = function(val) {
  this.type = Types.Number;
  this.val = parseFloat(val);
};

Scheme.Null = function() {
  this.type = Types.Null;
};

Scheme.Cons = function(car, cdr) {
  this.type = Types.Cons;
  this.car = car;
  if(cdr != undefined)  {
    this.cdr = cdr;
  } else {
    this.cdr = new Scheme.Null();
  }
};

Scheme.Cons.prototype.append = function(val) {

  var node = this;

  while(node.cdr.type != Types.Null) {

    if(node.cdr.type == Types.Cons) {
      node = node.cdr;
    } else {
      throw new Error("Illegal operation, cannot setCDR to something other than a CONS");
    }
  }

  node.cdr = val;


};

module.exports = Scheme;
