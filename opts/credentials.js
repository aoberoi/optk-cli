var fs = require('fs');
var path = require('path');
var osenv = require('osenv');
var async = require('async');
var dotenv = require('dotenv');
var _ = require('lodash');

module.exports.specs = {
  key: {
    abbr: 'k',
    type: 'string',
    help: 'An OpenTok API Key'
  },
  secret: {
    abbr: 's',
    type: 'string',
    help: 'The OpenTok API secret for given key'
  }
};

module.exports.readDefaults = function(initial, cb) {

  var readFromEnv = function(cb) {
    var key, secret;
    if (process.env.OPTK_KEY) {
      key = process.env.OPTK_KEY;
    }

    if (process.env.OPTK_SECRET) {
      secret = process.env.OPTK_SECRET;
    }

    process.nextTick(function() {
      cb({
        key: key,
        secret: secret
      });
    });
  };

  var readFromHome = function(cb) {
    osenv.home(function(err, home) {
      if (err) {
        return cb({});
      }

      fs.readFile(path.join(home, '.optk'), function(err, buf) {
        // if the file doesn't exist or we cannot read it, just return nothing in callback
        if (err) {
          return cb({});
        }

        var options = dotenv.parse(buf);

        cb(_.pick(options, 'key', 'secret'));
      });
    });
  };

  // NOTE: no good module to read/write from OS X keychain
  // var readFromKeychain = function(cb) {
  //   process.nextTick(function() {
  //     cb({});
  //   });
  // };

  var sources = [readFromEnv, readFromHome];

  // TODO: stop iteration if keys are already satisfied
  async.reduce(sources, initial, function(memo, source, callback) {
    source(function(creds) {
      callback(null, _.assign(memo, creds));
    });
  },

  function(err, result) {
    if (!result.key || !result.secret) {
      return cb(new Error('Could not find a key and secret after exhausting defaults'));
    } else {
      return cb(null, result);
    }
  });
};
