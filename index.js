const chalk = require('chalk')
const binance = require('node-binance-api')

const Bot = require('./bot')
const pckg = require('./package.json')
const { binanceKeys, markets } = require('./config')
const { logError } = require('./helpers')

console.log(chalk.green(`CryptoBot v${pckg.version}`))

binance.options({
  APIKEY: binanceKeys.api,
  APISECRET: binanceKeys.secret,
  test: true,
  useServerTime: true
})

binance.balance((error, balances) => {
  if (error) {
    logError(`Function binance.balance(): ${error.statusMessage}`)
    return process.exit()
  }

  const funds = Object.keys(balances)
    .filter((key) => parseFloat(balances[key].available) > 0)
    .reduce((obj, key) => {
      obj[key] = balances[key]
      return obj
    }, {})

  const bot = new Bot(funds)

  markets.forEach(({ symbol, strategyName }) => {
    let strategy
    try {
      strategy = require(`./strategies/${strategyName}`)
    } catch (error) {
      return logError(`${error.toString()}, skipping ${symbol}`)
    }

    binance.candlesticks(symbol, strategy.timeframe, (error, ticks) => {
      if (error) return logError(`Function binance.candlesticks(): ${error.statusMessage}`)

      const candles = ticks.map((tick) => ({
        time: tick[0],
        open: parseFloat(tick[1]),
        high: parseFloat(tick[2]),
        low: parseFloat(tick[3]),
        close: parseFloat(tick[4]),
        volume: parseFloat(tick[5]),
        trades: tick[8],
        volumePerTrade: tick[5] / tick[8]
      })).slice(0, strategy.periods)

      const chart = {
        candles: candles.length ? candles.reverse() : [],
        indicators: {}
      }

      bot.initMarket(symbol, chart, strategy)

      binance.websockets.candlesticks(symbol, strategy.timeframe, (candlesticks) => {
        const { k: ticks } = candlesticks
        const { t: time, o: open, h: high, l: low, c: close, v: volume, n: trades, x: isFinal } = ticks

        if (isFinal) {
          const candle = {
            time,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
            trades,
            volumePerTrade: volume / trades
          }

          bot.addCandle(symbol, candle)
        }
      })
    }, { limit: strategy.periods + 1 })
  })
})
