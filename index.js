#!/usr/bin/env node

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

parser.help('a tool to create opentok sessions and generate tokens');
parser.script('optk');
parser.parse();
