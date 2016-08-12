var parser = require('nomnom')();
var _ = require('lodash');
var OpenTok = require('opentok');
var chalk = require('chalk');
var handleError = require('../lib/error')('session');
var credentialsOptions = require('../opts/credentials');
var tokenOptions = require('../opts/token');

// jscs:disable maximumLineLength
var usage = chalk.bold('Usage:') + ' optk session ' + chalk.blue('[options] [credentials]') + '\n' +
    '\n' +
    chalk.blue('Options:') + '\n' +
    '   -p, --relayed                            ' + chalk.gray('create a relayed session  [true]') + '\n' +
    '   -m, --routed                             ' + chalk.gray('create a routed session  [false]') + '\n' +
    '   -l, --location                           ' + chalk.gray('location hint for session (IPv4 address)') + '\n' +
    '   --notoken                                ' + chalk.gray('do not output a token for the given session [false]') + '\n' +
    '   -a, --auto-archive                       ' + chalk.gray('create an automatically archived session [false]') + '\n' +
    '   --role publisher|subscriber|moderator    ' + chalk.gray('role for the generated token [publisher]') + '\n' +
    '   -e seconds, --expire seconds             ' + chalk.gray('expire time from the Unix epoch for the generated token [1 day later]') + '\n' +
    '   -d, --data                               ' + chalk.gray('data for the generated token') + '\n' +
    '   -u, --url                                ' + chalk.gray('Specify a custom OpenTok URL endpoint. Use this for dev, nightly, beta, or other environments') + '\n' +
    '\n' +
    chalk.blue('Credentials:') + '\n' +
    '   -k, --key        ' + chalk.gray('An OpenTok API Key') + '\n' +
    '   -s, --secret     ' + chalk.gray('The OpenTok API secret for given key') + '\n';

// jscs:enable maximumLineLength

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
    .option('autoArchive', {
        abbr: 'a',
        full: 'auto-archive',
        flag: true,
        default: false,
        help: 'create an automatically archived session'
    })
    .option('location', {
        abbr: 'l',
        type: 'string',
        help: 'location hint for session (IPv4 address)'
    })
    .option('noToken', {
        abbr: 'n',
        full: 'notoken',
        flag: true,
        default: false,
        help: 'do not output a token for the given session'
    })
    .option('url', {
        abbr: 'u',
        full: 'url',
        type: 'string',
        help: 'Specify a custom OpenTok URL endpoint. Use this for dev, nightly, beta, or other environments'
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

            if (opts.autoArchive) {
                val.archiveMode = 'always';
                val.mediaMode = 'routed';
            } else {
                val.archiveMode = 'manual';
            }

            return val;
        };

        var createTokenOptions = function() {
            return {
                expireTime: opts.expire,
                role: opts.role,
                data: opts.data
            };
        };

        var credentialsReady = function() {
            if (opts.url) {
                var opentok = new OpenTok(opts.key, opts.secret, opts.url);
            } else {
                var opentok = new OpenTok(opts.key, opts.secret);
            }

            opentok.createSession(createSessionOptions(), function(err, session) {
                if (err) {
                    return handleError(err);
                }

                console.log(session.sessionId);

                if (!opts.noToken) {
                    var token = session.generateToken(createTokenOptions());
                    console.log(token);
                }
            });
        };

        if (opts.relayed && opts.routed) {
            return handleError(new Error('Invalid media mode: cannot use both routed and relayed'));
        }

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
    .help('create a session')
    .usage(usage);

// NOTE: uses undocumented/untested API
_.assign(parser.commands.session.specs, credentialsOptions.specs);
_.assign(parser.commands.session.specs, tokenOptions.specs);
module.exports = parser.commands.session;
