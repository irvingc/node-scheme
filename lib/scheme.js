var Scheme = require('../lib/grammar');
var Util = require('../lib/util');
var builtins = require('../lib/builtins');
var Types = Scheme.Types;
var debug = Util.debug;
var format = Util.format;
var helpers = Scheme.Helpers;

Scheme.addProgramTree = function(tree) {
  this.tree = tree;
};

function makeFunctionDefinition(name, fun) {
  return new Scheme.Cons(new Scheme.Symbol(name), new Scheme.Function(fun));
}

function lookup(tolookup, alist) {

  debug('list is: ' + Util.format(alist));

  if(!helpers.isSymbol(tolookup)) {
    throw new Error('Can only lookup symbols');
  }

  var current = alist;

  while(!helpers.isNull(current)) {

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

  if(!helpers.isFunction(fun)) {
    throw new Error(format(fun) + ' is not a function');
  }

  var args = new Scheme.Null();

  var node = params;

  while(!helpers.isNull(node)) {
    var arg = new Scheme.Cons(_eval(node.car, symbols));

    if(helpers.isNull(args)) {
      args = arg;
    } else {
      helpers.append(args, arg);
    }

    node = node.cdr;
  }

  debug('Calling "' + format(fun) + '" with args: ' + Util.format(args));

  return fun.val(args);


}

function makeLambda(args, body, symbols) {

  debug('args: ' + format(args));
  debug('body: ' + format(body));
  return function(funargs) {

    var cur = args;
    var curfun = funargs;
    var alist = symbols;
    while(helpers.isCons(cur)) {

      if(helpers.isSymbol(cur.car)) {
        var def = new Scheme.Cons(cur.car, curfun.car);
        debug('Created entry: ' + format(def));
        var defentry = new Scheme.Cons(def);
        helpers.append(defentry, alist);
        alist = defentry;
        cur = cur.cdr;
        curfun = curfun.cdr;
      } else {
        throw new Error('Arguments to function must be symbols');
      }

    }

    return _eval(body, alist);

  }
}

function _eval(expr, symbols) {
  debug('_eval: ' + format(expr));

  if(helpers.isSymbol(expr)) {
    return lookup(expr, symbols);
  } else if(helpers.isCons(expr)) {

    if(helpers.isLambda(expr.car)) {
      var lambda = makeLambda(expr.cdr.car, expr.cdr.cdr.car, symbols);

      return new Scheme.Function(lambda);

    } else if(helpers.isDefine(expr.car)) {

      var evaled = _eval(expr.cdr.cdr.car, symbols);
      debug('evaled cdr: ' + Util.format(evaled));
      var def = new Scheme.Cons(expr.cdr.car, evaled);
      var listentry = new Scheme.Cons(def);
      // define manipulates global table
      helpers.append(symbolList, listentry);

      return evaled;

    } else if(helpers.isConditional(expr.car)) {

      var cond = _eval(expr.cdr.car, symbols);

      if(helpers.isTrue(cond)) {
        return _eval(expr.cdr.cdr.car, symbols);
      } else {
        return _eval(expr.cdr.cdr.cdr.car, symbols);
      }

    } else if(helpers.isQuote(expr.car)) {
      if(!helpers.isNull(expr.cdr)) {
        throw new Error("Quote takes a single argument");
      }
      return expr.cdr.car;
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
var isNullDef = makeFunctionDefinition('nullp', builtins.isNull);
var addDef = makeFunctionDefinition('+', builtins.add);
var eqDef = makeFunctionDefinition('eq', builtins.equal);
var cdrDef = makeFunctionDefinition('cdr', builtins.cdr);

var symbolList = new Scheme.Cons(addDef);
helpers.append(symbolList, new Scheme.Cons(isNullDef));
helpers.append(symbolList, new Scheme.Cons(eqDef));
helpers.append(symbolList, new Scheme.Cons(cdrDef));


Scheme.eval = function(expr) {
  try {
    return _eval(expr, symbolList);
  } catch (error) {
    return error;
  }
};


module.exports = Scheme;
