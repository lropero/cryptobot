const chalk = require('chalk')
const binance = require('node-binance-api')

const Bot = require('./bot')
const pckg = require('./package.json')
const { keys, markets, periods, timeframe } = require('./config')

const logError = (string) => console.log(chalk.red(`[Error] ${string}`))

console.log(chalk.green(`CryptoBot v${pckg.version}`))

binance.options({
  APIKEY: keys.api,
  APISECRET: keys.secret,
  test: true,
  useServerTime: true
})

binance.balance((error, balances) => {
  if (error) {
    logError(`binance.balance: ${error.statusMessage}`)
    return process.exit()
  }

  const funds = Object.keys(balances)
    .filter((key) => parseFloat(balances[key].available) > 0)
    .reduce((obj, key) => {
      obj[key] = balances[key]
      return obj
    }, {})

  const bot = new Bot(funds)

  markets.forEach((market) => {
    binance.candlesticks(market, timeframe, (error, ticks) => {
      if (error) return logError(`binance.candlesticks: ${error.statusMessage}`)

      const candles = ticks.map((tick) => ({
        time: tick[0],
        open: parseFloat(tick[1]),
        high: parseFloat(tick[2]),
        low: parseFloat(tick[3]),
        close: parseFloat(tick[4]),
        volume: parseFloat(tick[5]),
        trades: tick[8],
        volumePerTrade: tick[5] / tick[8]
      }))

      candles.pop()

      bot.addChart(market, candles)

      binance.websockets.candlesticks(market, timeframe, (candlesticks) => {
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

          bot.addCandle(market, candle)
        }
      })
    }, { limit: periods })
  })
})
