var Scheme = {};

Scheme.Types = {};

var Types = Scheme.Types;
Types.Identifier = 'IDENTIFIER';
Types.String = 'STRING';
Types.Number = 'NUMBER';
Types.Null = 'NULL';
Types.Cons = 'CONS';

Scheme.String = function(val) {
  this.type = Types.String;
  this.val = val.substring(1, val.length -1);
};
Scheme.String.prototype.isAtom = true;

Scheme.Identifier = function(val) {
  this.type = Types.Identifier;
  this.val = val.toLowerCase();
};
Scheme.Identifier.prototype.isAtom = true;


Scheme.Number = function(val) {
  this.type = Types.Number;
  this.val = parseFloat(val);
};
Scheme.Number.prototype.isAtom = true;

Scheme.Null = function() {
  this.type = Types.Null;
};
Scheme.Null.prototype.isAtom = true;

Scheme.Cons = function(car, cdr) {
  this.type = Types.Cons;
  this.car = car;
  if(cdr != undefined)  {
    this.cdr = cdr;
  } else {
    this.cdr = new Scheme.Null();
  }
};
Scheme.Cons.prototype.isAtom = false;

Scheme.Cons.prototype.setCDR = function(val) {

  var node = this;

  while(node.cdr.type != Types.Null) {

    if(node.cdr.type == Types.Cons) {
      node = node.cdr;
    } else {
      throw "Illegal operation, cannot setCDR to something other than a CONS";
    }
  }

  node.cdr = val;


};

module.exports = Scheme;
