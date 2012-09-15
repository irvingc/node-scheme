var Scheme = require('../lib/grammar');

Scheme.addProgramTree = function(tree) {
  console.log('addProgramTree');
  this.tree = tree;
};


Scheme.read = function(str) {
  var error_offsets = [];
  var error_lookaheads = [];

  var error_count = Scheme.parse(str, error_offsets, error_lookaheads);

  if(error_count > 0) {
    for(var i = 0; i < error_count; i++) {
      console.log('Parse error near "'+str.substr(error_offsets[i]) + '", expecting"' + error_lookaheads[i].join() + '"');
    }
  }

};


module.exports = Scheme;
