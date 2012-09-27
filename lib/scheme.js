var Scheme = require('../lib/grammar');
var Util = require('../lib/util');
var builtins = require('../lib/builtins');
var Types = Scheme.Types;
var isSymbol = builtins.isSymbol;
var isNull = builtins.isNull;

Scheme.addProgramTree = function(tree) {
  this.tree = tree;
};

function makeFunctionDefinition(name, fun) {
  return new Scheme.Cons(new Scheme.Symbol(name), new Scheme.Function(fun));
}

// Build alist
var isNullDef = makeFunctionDefinition('null?', builtins.isNull);
var addDef = makeFunctionDefinition('+', builtins.add);

var alist = new Scheme.Cons(addDef);
alist.append(isNullDef);


Scheme.read = function(str, callback) {
  var error_offsets = [];
  var error_lookaheads = [];

  var error_count = Scheme.parse(str, error_offsets, error_lookaheads);

  var error = null;
  var tree = null;

  if(error_count > 0) {
    var error_text = "";
    for(var i = 0; i < error_count; i++) {
      error_text += 'Parse error near "'+str.substr(error_offsets[i]) + '", expecting"' + error_lookaheads[i].join() + '"\n';
    }

    error = new Error(error_text);
  } else {
    tree = this.tree
  }

  callback(error, tree);

};

Scheme.lookup = function(tolookup) {


  if(!isSymbol(tolookup)) {
    return new Error('Can only lookup symbols');
  }

  var current = alist;

  do{
    if(current.car.car.val == tolookup.val) {
      return current.car.cdr;
    } else {
      current = current.cdr;
    }

  } while(current.cdr.type != Types.Null);

  return new Error('Symbol not found');

};

function evalFunction(expr) {
  var fun = Scheme.lookup(expr.car);

  if(!Util.isError(fun)) {

    var args = new Scheme.Null();

    var node = expr.cdr;

    while(node.type != Types.Null) {
      var arg = new Scheme.Cons(Scheme.eval(node.car));

      if(args.type == Types.Null) {
        args = arg;
      } else {
        args.append(arg);
      }

      node = node.cdr;
    }

    Util.debug('Calling "' + expr.car.val + '" with args: ' + Util.format(args));

    return fun.val(args);
  } else {
    return fun;
  }

}

function evalSymbol(expr) {
  switch(expr.car.val) {
    case Scheme.Special.Lambda:
      return new Error('Lambda not implemented');
    case Scheme.Special.Define:
      return new Error('Define not implemented');
    default:
      return evalFunction(expr);
  }
}

Scheme.eval = function(expr) {


  if(expr.type == Types.Cons) {

    switch(expr.car.type) {
     case Types.Symbol:
       return evalSymbol(expr);
     case Types.Cons:
        throw new Error('Cons as car not implemented');
      default:
        throw new Error('Semantic error, cannot eval');
    }

  } else {
    return expr;
  }

};


module.exports = Scheme;
