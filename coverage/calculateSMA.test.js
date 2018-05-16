const candles = require('./candles')
const { calculateSMA } = require('../helpers')

test('calculateSMA', () => {
  const closes = candles.map((candle) => candle.close)
  const sma = calculateSMA(closes, 10)
  expect(sma.toFixed(3)).toBe('8271.543')
})
