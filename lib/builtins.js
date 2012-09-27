var Scheme = require('../lib/definitions');
var Types = Scheme.Types;

function isCons(val) {
  return (val.type && val.type == Types.Cons);
}

function isNumber(val) {
  return (val.type && val.type == Types.Number);
}

function isNull(val) {
  return (val.type && val.type == Types.Null);
}

function isSymbol(val) {
  return (val.type && val.type== Types.Symbol);
}

function equal(args) {
  if(isCons(args) && isCons(args.cdr)) {
    return args.car.type == args.cdr.car.type && args.car.val == args.cdr.car.val;

  }
  return false;
}

function cdr(args) {
  if(isCons(args) && isCons(args.car)) {
    return args.car.cdr;
  }
  throw new Error('Can only cdr lists');
}

function add(args) {

  if(isCons(args)) {

    var result = new Scheme.Number(0);
    var node = args;

    while(isCons(node)) {

      if(isNumber(node.car)) {
        result.val += node.car.val;
      } else {
        throw new Error('Adding only works on numbers');
      }

      node = node.cdr;

    }

    if(isNull(node)) {
      return result;
    } else {
      throw new Error('Adding only works on proper lists');
    }

  } else {
    throw new Error('adding only works on lists of objects');
  }
}

module.exports = {
  isCons: isCons,
  isNumber: isNumber,
  isNull: isNull,
  isSymbol: isSymbol,
  equal: equal,
  add: add,
  cdr: cdr
};

