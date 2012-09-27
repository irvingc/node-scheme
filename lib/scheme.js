var Scheme = require('../lib/grammar');

Scheme.addProgramTree = function(tree) {
  this.tree = tree;
};


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


module.exports = Scheme;
