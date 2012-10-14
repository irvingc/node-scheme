var Scheme = require('../lib/definitions');
var helpers = Scheme.Helpers;
var Types = Scheme.Types;

function isNull(args) {
  var result = new Scheme.Boolean(false);
  if(helpers.isNull(args.car)) {
    result.val = true;
  }
  return result;
}

function equal(args) {
  var result = new Scheme.Boolean(false);
  if(helpers.isCons(args) && helpers.isCons(args.cdr)
    && args.car.type == args.cdr.car.type && args.car.val == args.cdr.car.val) {
    result.val = true;
  }

  return result;
}

function cdr(args) {
  if(helpers.isCons(args) && helpers.isCons(args.car)) {
    return args.car.cdr;
  }
  throw new Error('Can only cdr lists');
}

function add(args) {

  if(helpers.isCons(args)) {

    var result = new Scheme.Number(0);
    var node = args;

    while(helpers.isCons(node)) {

      if(helpers.isNumber(node.car)) {
        result.val += node.car.val;
      } else {
        throw new Error('Adding only works on numbers');
      }

      node = node.cdr;

    }

    if(helpers.isNull(node)) {
      return result;
    } else {
      throw new Error('Adding only works on proper lists');
    }

  } else {
    throw new Error('adding only works on lists of objects');
  }
}

module.exports = {
  isNull: isNull,
  equal: equal,
  add: add,
  cdr: cdr
};

