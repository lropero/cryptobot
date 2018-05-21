const chalk = require('chalk')

function logError (string) {
  console.log(chalk.red(`[Error] ${string}`))
}

module.exports = logError
