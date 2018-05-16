const candles = require('./candles')
const { calculateEMA } = require('../helpers')

test('calculateEMA', () => {
  const closes = candles.map((candle) => candle.close)
  const ema = calculateEMA(closes, 10)
  expect(ema.toFixed(3)).toBe('8278.862')
})
