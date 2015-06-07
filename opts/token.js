module.exports.specs = {
  role: {
    choices: ['publisher', 'subscriber', 'moderator'],
    metavar: 'publisher|subscriber|moderator',
    help: 'role for the generated token [publisher]'
  },
  expire: {
    abbr: 'e',
    type: 'string',
    help: 'expire time (ms from the Unix epoch) for the generated token [1 day later]',
    callback: function(expire) {
      try {
        parseInt(expire, 10);
      } catch (e) {
        return 'expire must be an integer';
      }
    }
  },
  data: {
    abbr: 'd',
    type: 'string',
    help: 'data for the generated token'
  }
};
