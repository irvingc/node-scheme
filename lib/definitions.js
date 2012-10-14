var Scheme = {
  Types: {
    Function: 'FUNCTION',
    Boolean: 'BOOLEAN',
    Symbol: 'SYMBOL',
    String: 'STRING',
    Number: 'NUMBER',
    Null: 'NULL',
    Cons: 'CONS'
  },
  Special: {
    Lambda: 'LAMBDA',
    Define: 'DEFINE',
    Quote: 'QUOTE',
    Cond: 'IF'
  }
};

var Types = Scheme.Types;

Scheme.Boolean = function(val) {
  this.type = Types.Boolean;
  this.val = val;
};

Scheme.Function = function(fun, body) {
  this.type = Types.Function;
  this.body = body;
  this.val = fun;
};

Scheme.String = function(val) {
  this.type = Types.String;
  this.val = val.substring(1, val.length -1);
};

Scheme.Symbol = function(val) {
  this.type = Types.Symbol;
  this.val = val.toUpperCase();
};


Scheme.Number = function(val) {
  this.type = Types.Number;
  this.val = parseFloat(val);
};

Scheme.Null = function() {
  this.type = Types.Null;
};

Scheme.Cons = function(car, cdr) {
  this.type = Types.Cons;
  this.car = car;
  if(cdr != undefined)  {
    this.cdr = cdr;
  } else {
    this.cdr = new Scheme.Null();
  }
};

Scheme.Helpers = {
  isCons: function(val) {
            return (val.type && val.type == Types.Cons);
          },

  isNumber: function(val) {
              return (val.type && val.type == Types.Number);
            },

  isNull: function(val) {
            return (val.type && val.type == Types.Null);
          },

  isSymbol: function(val) {
              return (val.type && val.type== Types.Symbol);
            },

  isLambda: function(expr) {
              return Scheme.Helpers.isSymbol(expr) && expr.val == Scheme.Special.Lambda;
            },

  isDefine: function(expr) {
              return Scheme.Helpers.isSymbol(expr) && expr.val == Scheme.Special.Define;
            },

  isConditional: function(expr) {
                   return Scheme.Helpers.isSymbol(expr) && expr.val == Scheme.Special.Cond;
                 },

  isQuote: function(expr) {
             return Scheme.Helpers.isSymbol(expr) && expr.val == Scheme.Special.Quote;
           },
  isFunction: function(expr) {
                return (expr.type && expr.type == Types.Function);
              },
  isBoolean: function(expr) {
               return (expr.type && expr.type == Types.Boolean);
             },
  isTrue: function(expr) {
            return (Scheme.Helpers.isBoolean(expr) && expr.val);
          },

  append: function(list, val) {

            if(!Scheme.Helpers.isCons(val)) {
              throw new Error("you can only append to lists");
            }

            var node = list;

            while(node.cdr.type != Types.Null) {

              if(node.cdr.type == Types.Cons) {
                node = node.cdr;
              } else {
                throw new Error("Illegal operation, cannot setCDR to something other than a CONS");
              }
            }

            node.cdr = val;

          }
};


module.exports = Scheme;
