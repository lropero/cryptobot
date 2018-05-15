function calculateEMA (values, periods) {
  if (values.length - periods < 0) return false

  return values.slice(values.length - periods).reduce((sum, value, index) => {
    sum += parseFloat(value) * (index + 1)
    return sum
  }, 0) / ((periods * (periods + 1)) / 2)
}

module.exports = calculateEMA
