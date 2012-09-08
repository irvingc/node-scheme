var fs = require('fs');
var TARGET_DIR = 'lib';
var SRC_DIR = 'grammars';

desc('Compile the Scheme grammar with JS/CC');
task('default', function(params) {

    jake.mkdirP(TARGET_DIR);

    var grammars = jake.readdirR('grammars');

    grammars.forEach(function(grammar) {
      if(fs.statSync(grammar).isFile()) {
        var output = grammar.replace(SRC_DIR, '');
        output = TARGET_DIR + output.replace('.par', '.js');
        console.log("Compiling: " + grammar + " to: " + output);
        jake.exec(['jscc -v -w -o ' + output +' ' + grammar], {printStdout: true});
      }
    });
});

desc('Run the tests for the Scheme grammar');
task('test', ['default'], function(params) {
    jake.exec(['mocha'], {printStdout: true, printStderr: true});
});

desc('Cleans all files');
task('clean', function(params) {
    jake.rmRf(TARGET_DIR);
});
