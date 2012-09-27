var Scheme = require('../lib/definitions');
var imported = require('util');
var Types = Scheme.Types;

var Utils = {};

Utils.isError = imported.isError;

Utils.debug = function(str) {
  console.log(str);
}

Utils.format = function(node) {

  if(!node) {
    return '';
  }

  if(imported.isError(node)) {
    console.log(node);
    return 'Error: ' + node.message;
  }

  switch(node.type) {
    case Types.String:
      return '"' + node.val + '"';
    case Types.Symbol:
      return '<' + node.val + '>';
    case Types.Number:
      return node.val;
    case Types.Null:
      return '()';
    case Types.Cons:
      var str = '(' + Utils.format(node.car);

      var next = node.cdr;

      while(next.type != Types.Null) {

        if(next.type == Types.Cons) {
          str = str + ' ' + Utils.format(next.car);
          next = next.cdr;
        } else {
          str = str + '..' + Utils.format(next);
          break;
        }
      }

      return str + ')';
    case Types.Function:
      return 'Function';
    default:
      return 'UNKNOWN';
  }

};



module.exports = Utils;


