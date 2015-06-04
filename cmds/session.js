var parser = require('nomnom')();
var _ = require('lodash');
var OpenTok = require('opentok');
var handleError = require('../lib/error')('session');
var credentials = require('../opts/credentials');

// TODO: generate token by default and option for no token
//       include token options
// TODO: add archive mode
parser.command('session')
  // TODO: don't let this print out false as the default value
  .option('relayed', {
    abbr: 'p',
    flag: true,
    default: false,
    help: 'create a relayed session'
  })
  .option('routed', {
    abbr: 'm',
    flag: true,
    default: false,
    help: 'create a routed session'
  })
  .option('location', {
    abbr: 'l',
    type: 'string',
    help: 'location hint for session'
  })
  .callback(function(opts) {

    var createSessionOptions = function() {
      var val = {};

      if (opts.routed) {
        val.mediaMode = 'routed';
      } else if (opts.relayed) {
        val.mediaMode = 'relayed';
      }

      if (opts.location) {
        val.location = opts.location;
      }

      return val;
    };

    var credentialsReady = function() {
      var opentok = new OpenTok(opts.key, opts.secret);

      opentok.createSession(createSessionOptions(), function(err, session) {
        if (err) return handleError(err);
        console.log(session.sessionId);
      });
    };

    if (opts.relayed && opts.routed) {
      return handleError(new Error('Invalid media mode: cannot use both routed and relayed'));
    }

    if (!opts.key || !opts.secret) {
      credentials.readDefaults(_.pick(opts, 'key', 'secret'), function(err, creds) {
        if (err) return handleError(err);
        _.assign(opts, creds);
        credentialsReady();
      });
    } else {
      process.nextTick(credentialsReady);
    }
  })
  .help('create a session');


// NOTE: uses undocumented/untested API
_.assign(parser.commands['session'].specs, credentials.specs);
module.exports = parser.commands['session'];
