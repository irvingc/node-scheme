var Scheme = require('../lib/definitions');
var Types = Scheme.Types;

var Utils = {};

Utils.format = function(node) {

  switch(node.type) {
    case Types.String:
      return '"' + node.val + '"';
    case Types.Identifier:
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
          next = new Scheme.Null();
        }
      }

      return str + ')';

    default:
      return 'UNKNOWN';
  }

};



module.exports = Utils;

