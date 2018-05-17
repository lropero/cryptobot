const server = require('./server')
const { calculateEMA, calculateSMA, withIndicators } = require('./helpers')
const { indicators, periods } = require('./config')

class Bot {
  constructor (funds) {
    this.charts = {}
    this.funds = funds

    server(this)
  }

  addCandle (market, candle) {
    const chart = this.charts[market]

    chart.push({
      ...candle,
      indicators: {}
    })

    while (chart.length > periods) {
      chart.shift()
    }

    const list = Object.keys(indicators)
    const hasEMA = list.includes('ema')
    const hasSMA = list.includes('sma')
    const hasVOL = list.includes('vol')

    if (hasEMA || hasSMA) {
      const closes = chart.map((candle) => candle.close)
      if (hasEMA) chart[chart.length - 1].indicators.ema = calculateEMA(closes, indicators.ema)
      if (hasSMA) chart[chart.length - 1].indicators.sma = calculateSMA(closes, indicators.sma)
    }

    if (hasVOL) {
      const volumes = chart.map((candle) => candle.volume)
      chart[chart.length - 1].indicators.vol = calculateSMA(volumes, indicators.vol)
    }
  }

  addChart (market, candles) {
    this.charts[market] = withIndicators(candles)
  }

  getFunds () {
    return this.funds
  }
}

module.exports = Bot
