module.exports = (req, res) => {
  const bot = req.app.get('bot')

  res.json({
    funds: bot.getFunds()
  })
}
