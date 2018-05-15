const config = require('./config')
const server = require('./server')
const { calculateEMA, calculateSMA } = require('./helpers')

class Bot {
  constructor (funds) {
    this.charts = []
    this.funds = funds

    server(this)
  }

  addCandle (market, candle) {
    const chart = this.charts.filter((chart) => chart.market === market)[0]

    chart.candles.push(candle)
    while (chart.candles.length > config.candles) {
      chart.candles.shift()
    }

    const closes = chart.candles.map((candle) => candle.close)
    chart.ema = calculateEMA(closes, 30)
    chart.sma = calculateSMA(closes, 10)
  }

  addChart (market, candles, ema, sma) {
    const closes = candles.map((candle) => candle.close)

    const chart = {
      market,
      candles,
      ema: calculateEMA(closes, 30),
      sma: calculateSMA(closes, 10)
    }

    this.charts.push(chart)
  }

  getFunds () {
    return this.funds
  }
}

module.exports = Bot
