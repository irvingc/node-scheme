var Scheme = require('../lib/grammar');
var Util = require('../lib/util');
var builtins = require('../lib/builtins');
var Types = Scheme.Types;
var isSymbol = builtins.isSymbol;
var isNull = builtins.isNull;
var isCons = builtins.isCons;
var debug = Util.debug;
var format = Util.format;

Scheme.addProgramTree = function(tree) {
  this.tree = tree;
};

function makeFunctionDefinition(name, fun) {
  return new Scheme.Cons(new Scheme.Symbol(name), new Scheme.Function(fun));
}

function lookup(tolookup, alist) {

  debug('list is: ' + Util.format(alist));

  if(!isSymbol(tolookup)) {
    throw new Error('Can only lookup symbols');
  }

  var current = alist;

  while(!isNull(current)) {

    debug('comparing: ' + current.car.car.val);
    if(current.car.car.val == tolookup.val) {
      return current.car.cdr;
    } else {
      current = current.cdr;
    }

  } 

  throw new Error('Symbol "' + tolookup.val + '" not defined.');

};

function apply(fun, params, symbols) {
  debug('Apply: ' + format(fun));

  if(fun.type != Types.Function) {
    throw new Error('Functor is not a function');
  }

  var args = new Scheme.Null();

  var node = params;

  while(node.type != Types.Null) {
    var arg = new Scheme.Cons(_eval(node.car, symbols));

    if(args.type == Types.Null) {
      args = arg;
    } else {
      args.append(arg);
    }

    node = node.cdr;
  }

  debug('Calling "' + format(fun) + '" with args: ' + Util.format(args));

  return fun.val(args);


}

function makeLambda(args, body) {

  debug('args: ' + format(args));
  debug('body: ' + format(body));
  return function(funargs) {
    var cur = args;
    var curfun = funargs;
    var alist = symbolList;
    while(isCons(cur)) {

      if(isSymbol(cur.car)) {
        var def = new Scheme.Cons(cur.car, curfun.car);
        debug('Created entry: ' + format(def));
        var defentry = new Scheme.Cons(def);
        defentry.append(alist);
        alist = defentry;
        cur = cur.cdr;
        curfun = curfun.cdr;
      } else {
        throw new Error('args is not a symbol!?');
      }

    }

    return _eval(body, alist);

  }
}

function isLambda(expr) {
  return isSymbol(expr) && expr.val == Scheme.Special.Lambda;
}

function isDefine(expr) {
  return isSymbol(expr) && expr.val == Scheme.Special.Define;
}

function isConditional(expr) {
  return isSymbol(expr) && expr.val == Scheme.Special.Conditional;
}

function _eval(expr, symbols) {
  debug('_eval: ' + format(expr));

  if(isSymbol(expr)) {
    return lookup(expr, symbols);
  } else if(isCons(expr)) {

    if(isLambda(expr.car)) {
      var lambda = makeLambda(expr.cdr.car, expr.cdr.cdr.car);
      return new Scheme.Function(lambda);
    } else if(isDefine(expr.car)) {

      var evaled = _eval(expr.cdr.cdr.car, symbols);
      debug('evaled cdr: ' + Util.format(evaled));
      var def = new Scheme.Cons(expr.cdr.car, evaled);
      var listentry = new Scheme.Cons(def, symbols);
      // define manipulates global table
      symbolList = listentry;

      return undefined;
    } else if(isConditional(expr.car)) {

      if(_eval(expr.cdr.car, symbols)) {
        return _eval(expr.cdr.cdr.car, symbols);
      } else {
        return _eval(expr.cdr.cdr.cdr.car, symbols);
      }

    } else {
      var functor = _eval(expr.car, symbols);
      return apply(functor, expr.cdr, symbols);
    }

  } else {
    return expr;
  }

}

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
// Build alist
var isNullDef = makeFunctionDefinition('null?', builtins.isNull);
var addDef = makeFunctionDefinition('+', builtins.add);
var eqDef = makeFunctionDefinition('eq', builtins.equal);

var symbolList = new Scheme.Cons(addDef);
symbolList.append(new Scheme.Cons(isNullDef));
symbolList.append(new Scheme.Cons(eqDef));



Scheme.eval = function(expr) {
  try {
    return _eval(expr, symbolList);
  } catch (error) {
    return error;
  }
};


module.exports = Scheme;
