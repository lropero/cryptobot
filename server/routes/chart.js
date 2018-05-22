const createError = require('http-errors')

module.exports = (req, res) => {
  const bot = req.app.get('bot')

  const symbol = req.params.symbol
  const chart = bot.getChart(symbol)

  if (!chart) {
    return res.status(404).json(createError(404))
  }

  res.json(chart)
}
