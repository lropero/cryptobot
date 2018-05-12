const pckg = require('../../package.json')

module.exports = (req, res) => {
  res.json({
    name: `CryptoBot v${pckg.version}`,
    dependencies: pckg.dependencies,
    devDependencies: pckg.devDependencies
  })
}
