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

Scheme.Null = function() {
  this.type = 'NULL';
};

Scheme.Cons = function(car, cdr) {
  this.type = 'CONS';
  this.car = car;
  if(cdr != undefined)  {
    this.cdr = cdr;
  } else {
    this.cdr = new Scheme.Null();
  }
};

Scheme.Cons.prototype.setCDR = function(val) {

  var node = this;

  while(node.cdr.type != 'NULL') {

    if(node.cdr.type == 'CONS') {
      node = node.cdr;
    } else {
      console.log("Illegal operation");
    }
  }

  node.cdr = val;


};

module.exports = Scheme;
