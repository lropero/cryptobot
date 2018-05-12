const express = require('express')

const router = express.Router()

router.get('/info', require('./info'))

module.exports = router
