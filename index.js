const chalk = require('chalk')

const pckg = require('./package.json')

console.log(chalk.yellow(`CryptoBot v${pckg.version}`))
