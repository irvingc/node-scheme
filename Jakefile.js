var fs = require('fs');
var path = require('path');
var TARGET_DIR = 'lib';
var SRC_DIR = 'grammar';
var GRAMMAR_EXTENSION = '.par';

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

desc('Compile the Scheme grammar with JS/CC');
task('default', function(params) {

    jake.mkdirP(TARGET_DIR);

    var grammars = jake.readdirR(SRC_DIR);
    
    var cmds = [];

    grammars.forEach(function(grammar) {
      if(fs.statSync(grammar).isFile() 
        && endsWith(grammar, GRAMMAR_EXTENSION)) {
        var output = TARGET_DIR + "/" +  path.basename(grammar, GRAMMAR_EXTENSION) + '.js';
        cmds.push('jscc -v -w -o ' + output +' ' + grammar);
        console.log("Preparing to compile: " + grammar + " to: " + output);
      }
    });

    jake.exec(cmds, function () {
      console.log('Grammar compilation finished');
      complete();
    }, {printStdout: true});

}, {async: true} );

desc('Run the tests for the Scheme grammar');
task('test', ['default'], function(params) {
    jake.exec(['mocha'], function() {
      complete();
    },{printStdout: true, printStderr: true});
}, {async: true});

desc('Cleans all files');
task('clean', function(params) {
    jake.rmRf(TARGET_DIR);
});
