const config = require('./config')
const server = require('./server')
const { calculateEMA, calculateSMA, withIndicators } = require('./helpers')

class Bot {
  constructor (funds) {
    this.charts = []
    this.funds = funds

    server(this)
  }

  addCandle (market, candle) {
    const chart = this.charts.filter((chart) => chart.market === market)[0]

    chart.candles.push({
      ...candle,
      indicators: {}
    })

    while (chart.candles.length > config.candles) {
      chart.candles.shift()
    }

    const closes = chart.candles.map((candle) => candle.close)
    const volumes = chart.candles.map((candle) => candle.volume)

    chart.candles[chart.candles.length - 1].indicators.ema = calculateEMA(closes, 30)
    chart.candles[chart.candles.length - 1].indicators.sma = calculateSMA(closes, 10)
    chart.candles[chart.candles.length - 1].indicators.vol = calculateSMA(volumes, 20)
  }

  addChart (market, candles) {
    const chart = {
      market,
      candles: withIndicators(candles, {
        ema: 30,
        sma: 10,
        vol: 20
      })
    }

    this.charts.push(chart)
  }

  getFunds () {
    return this.funds
  }
}

module.exports = Bot
