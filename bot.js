const chalk = require('chalk')
const tulind = require('tulind')

const server = require('./server')
const { logError } = require('./helpers')

class Bot {
  constructor (funds) {
    this.funds = funds
    this.markets = {}

    server(this)
  }

  initMarket (symbol, chart, strategy) {
    this.markets[symbol] = {
      chart,
      strategy
    }

    if (chart.candles.length) {
      this.calculateIndicators(symbol, true)
    }

    console.log(chalk.blue(`Market ${chalk.bold(symbol)} initialized -> using strategy ${chalk.bold(strategy.name || 'Unnamed strategy')}`))
  }

  addCandle (symbol, candle) {
    const { chart, strategy } = this.markets[symbol]

    chart.candles.unshift(candle)
    while (chart.candles.length > strategy.periods) {
      chart.candles.pop()
    }

    this.calculateIndicators(symbol)
    this.executeStrategy(symbol)
  }

  calculateIndicators (symbol, init = false) {
    const { chart, strategy } = this.markets[symbol]

    const candles = chart.candles.slice().reverse()
    const allowedInputs = Object.keys(candles[0])
    const indicators = strategy.indicators || []

    indicators.forEach(({ name = '', indicator = '', inputs = {}, options = {} }) => {
      if (init && chart.indicators[name]) return logError(`Indicator names must be unique, ${name} already exists`)

      const indicatorObj = tulind.indicators[indicator]
      if (!indicatorObj) return logError(`Indicator ${indicator} doesn't exists`)

      let valid = true

      const indicatorInputs = []
      indicatorObj.input_names.forEach((inputName) => {
        if (!allowedInputs.includes(inputName) && !allowedInputs.includes(inputs[inputName])) {
          logError(!Object.keys(inputs).includes(inputName) ? `Missing input '${inputName}' for indicator ${name}` : `Allowed values for input ${name}->${inputName}: ${allowedInputs.join(', ')}`)
          valid = false
          return
        }
        if (valid) {
          const input = allowedInputs.includes(inputName) ? inputName : inputs[inputName]
          indicatorInputs.push(candles.map((candle) => candle[input]))
        }
      })

      const indicatorOptions = []
      indicatorObj.option_names.forEach((optionName) => {
        if (!Object.keys(options).includes(optionName)) {
          logError(`Missing option '${optionName}' for indicator ${name}`)
          valid = false
        }
        if (valid) {
          indicatorOptions.push(options[optionName])
        }
      })

      if (!valid) return

      indicatorObj.indicator(indicatorInputs, indicatorOptions, (error, results) => {
        if (error) return logError(`Indicator ${name}: ${error.toString()}`)
        chart.indicators[name] = {}
        indicatorObj.output_names.forEach((outputName, index) => {
          chart.indicators[name][outputName] = results[index].reverse()
        })
      })
    })
  }

  // TODO
  executeStrategy (symbol) {
    // const { rules } = this.markets[symbol].strategy
  }

  getChart (symbol) {
    return this.markets[symbol] && this.markets[symbol].chart
  }

  getFunds () {
    return this.funds
  }
}

module.exports = Bot
