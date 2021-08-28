const express = require('express')
const router = express.Router()
const columnRoutes = require('./columnRoutes')
const itemRoutes = require('./itemRoutes')

router.use('/columns', columnRoutes)
router.use('/items', itemRoutes)

module.exports = router