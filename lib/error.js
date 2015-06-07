var chalk = require('chalk');

module.exports = function(cmdName) {
  return function(err) {
    console.log(chalk.red.bold(cmdName + ':', err.message));
  };
};
