function calculateSMA (values, periods) {
  if (values.length - periods < 0) return false

  return values.slice(values.length - periods).reduce((sum, value) => {
    sum += parseFloat(value)
    return sum
  }, 0) / periods
}

module.exports = calculateSMA
