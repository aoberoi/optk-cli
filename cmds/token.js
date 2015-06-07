var parser = require('nomnom')();
var _ = require('lodash');
var OpenTok = require('opentok');
var chalk = require('chalk');
var handleError = require('../lib/error')('session');
var credentialsOptions = require('../opts/credentials');
var tokenOptions = require('../opts/token');

// jscs:disable maximumLineLength
var usage = chalk.bold('Usage:') + ' optk token session ' + chalk.blue('[options] [credentials]') + '\n' +
'\n' +
chalk.blue('Options:') + '\n' +
'   --role publisher|subscriber|moderator   ' + chalk.gray('role for the generated token [publisher]') + '\n' +
'   -e, --expire                            ' + chalk.gray('expire time (ms from the Unix epoch) for the generated token [1 day later]') + '\n' +
'   -d, --data                              ' + chalk.gray('data for the generated token') + '\n' +
'\n' +
chalk.blue('Credentials:') + '\n' +
'   -k, --key        ' + chalk.gray('An OpenTok API Key') + '\n' +
'   -s, --secret     ' + chalk.gray('The OpenTok API secret for given key') + '\n';

// jscs:enable maximumLineLength

parser.command('token')
  .option('session', {
    type: 'string',
    position: 1,
    required: true,
    help: 'The session ID for the token to generate [required]'
  })
  .callback(function(opts) {

    var createTokenOptions = function() {
      return {
        expireTime: opts.expire,
        role: opts.role,
        data: opts.data
      };
    };

    var credentialsReady = function() {
      var opentok = new OpenTok(opts.key, opts.secret);

      try {
        console.log(opentok.generateToken(opts.session, createTokenOptions()));
      } catch (e) {
        handleError(e);
      }
    };

    if (!opts.key || !opts.secret) {
      credentialsOptions.readDefaults(_.pick(opts, 'key', 'secret'), function(err, creds) {
        if (err) {
          return handleError(err);
        }

        _.assign(opts, creds);
        credentialsReady();
      });
    } else {
      process.nextTick(credentialsReady);
    }
  })
  .help('generate a token')
  .usage(usage);

// NOTE: uses undocumented/untested API
_.assign(parser.commands.token.specs, credentialsOptions.specs);
_.assign(parser.commands.token.specs, tokenOptions.specs);
module.exports = parser.commands.token;
