const chalk = require('chalk')
const createError = require('http-errors')
const express = require('express')
const morgan = require('morgan')

const routes = require('./routes')

module.exports = (bot) => {
  const server = express()

  server.set('bot', bot)

  server.use(express.urlencoded({ extended: false }))
  server.use(express.json())

  if (server.get('env') === 'development') {
    server.use(morgan('dev'))
  }

  server.use('/', routes)

  server.use((req, res) => res.status(405).json(createError(405)))

  const port = process.env.PORT || 7007
  server.listen(port)
  console.log(chalk.yellow(`Server listening on port ${port}`))
}
