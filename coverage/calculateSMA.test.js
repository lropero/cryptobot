const candles = require('./candles')
const { calculateSMA } = require('../helpers')

test('calculateSMA', () => {
  const closes = candles.map((candle) => candle.close)
  const sma = calculateSMA(closes, 10)
  expect(sma.toFixed(2)).toBe('8458.72')
})
