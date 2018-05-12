const chalk = require('chalk')

const pckg = require('./package.json')
const server = require('./server')

console.log(chalk.yellow(`CryptoBot v${pckg.version}`))
server()
