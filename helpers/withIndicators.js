const calculateEMA = require('./calculateEMA')
const calculateSMA = require('./calculateSMA')
const { indicators } = require('../config')

function withIndicators (candles) {
  const candlesWithIndicators = []

  const list = Object.keys(indicators)
  const hasEMA = list.includes('ema')
  const hasSMA = list.includes('sma')
  const hasVOL = list.includes('vol')

  candles.forEach((candle) => {
    candlesWithIndicators.push({
      ...candle,
      indicators: {}
    })

    if (hasEMA || hasSMA) {
      const closes = candlesWithIndicators.map((candle) => candle.close)
      if (hasEMA) candlesWithIndicators[candlesWithIndicators.length - 1].indicators.ema = calculateEMA(closes, indicators.ema)
      if (hasSMA) candlesWithIndicators[candlesWithIndicators.length - 1].indicators.sma = calculateSMA(closes, indicators.sma)
    }

    if (hasVOL) {
      const volumes = candlesWithIndicators.map((candle) => candle.volume)
      candlesWithIndicators[candlesWithIndicators.length - 1].indicators.vol = calculateSMA(volumes, indicators.vol)
    }
  })

  return candlesWithIndicators
}

module.exports = withIndicators
