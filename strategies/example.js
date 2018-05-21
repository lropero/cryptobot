module.exports = {
  name: 'Example strategy',
  periods: 50,
  timeframe: '5m',
  indicators: [ // List of available indicators: https://tulipindicators.org/list
    {
      name: 'macd',
      inputs: {
        real: 'close'
      },
      options: {
        'long period': 26,
        'short period': 12,
        'signal period': 9
      }
    },
    {
      name: 'sma',
      inputs: {
        real: 'close'
      },
      options: {
        period: 14
      }
    },
    {
      name: 'stoch',
      options: {
        '%d period': 7,
        '%k period': 14,
        '%k slowing period': 3
      }
    }
  ],
  rules: {}
}
