var parser = require('nomnom')();
var _ = require('lodash');
var OpenTok = require('opentok');
var handleError = require('../lib/error')('session');
var credentials = require('../opts/credentials');

parser.command('token')
  .option('role', {
    choices: ['publisher', 'subscriber', 'moderator'],
    help: 'The role for the generated token'
  })
  .option('expire', {
    abbr: 'e',
    type: 'string',
    callback: function(expire) {
      try {
        parseInt(expire, 10);
      } catch (e) {
        return "expire must be an integer";
      }
    },
    help: 'The expire time (in milliseconds from the Unix epoch) for the generated token'
  })
  .option('data', {
    abbr: 'd',
    type: 'string',
    help: 'The data for the generated token'
  })
  .option('session', {
    type: 'string',
    required: true,
    help: 'The session ID for the token to generate'
  })
  .callback(function(opts) {

    var createTokenOptions = function() {
      return {
        expireTime: opts.expire,
        role: opts.role,
        data: opts.data
      }
    };

    var credentialsReady = function() {
      var opentok = new OpenTok(opts.key, opts.secret);

      console.log(opentok.generateToken(opts.session, createTokenOptions()));
    };

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
  .help('generate a token');

// NOTE: uses undocumented/untested API
_.assign(parser.commands['token'].specs, credentials.specs);
module.exports = parser.commands['token'];
