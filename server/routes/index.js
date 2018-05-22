const express = require('express')

const router = express.Router()

router.get('/chart/:symbol', require('./chart'))
router.get('/funds', require('./funds'))
router.get('/info', require('./info'))

module.exports = router
