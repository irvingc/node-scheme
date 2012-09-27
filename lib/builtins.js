var Scheme = require('../lib/definitions');
var Types = Scheme.Types;

module.exports = {

  add: function(args) {
         if(args.type && args.type == Types.Cons) {

           var result = new Scheme.Number(0);
           var node = args;

           while(node.type == Types.Cons) {

             if(node.car.type == Types.Number) {
               result.val += node.car.val;
             } else {
               throw new Error('Adding only works on numbers');
             }

             node = node.cdr;

           }

           if(node.type == Types.Null) {
             return result;
           } else {
             throw new Error('Adding only works on proper lists');
           }

         } else {
           throw new Error('adding only works on lists of objects');
         }
       },
  isNull: function(val) {
            return (val.type && val.type == Types.Null);
          },
  isSymbol: function(val) {
              return (val.type && val.type== Types.Symbol);
            }

};


