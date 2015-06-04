#!/usr/bin/env node

var opentok = require('opentok');

var parser = require('nomnom')();
var cmds = {
  session: require('./cmds/session'),
  token: require('./cmds/token')
};

// Mount commands
// NOTE: uses undocumented/untested API
for (var cmd in cmds) {
  parser.commands[cmd] = cmds[cmd];
}
parser.fallback = cmds.session;

parser.help('a tool to create opentok sessions and generate tokens');
parser.script('optk');
parser.parse();


// TODO: option to export the values as environment variables
// TODO: add jshint and jscs
// TODO: output formatting (syntaxes: JSON, environment vars, flat, js vars, xcconfig, java system properties)
// TODO: create jsbin command (templates: multiparty, 1to1, helloworld)
