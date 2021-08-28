const express = require('express')
const router = express.Router()
const itemController = require('../controllers/itemController')

router.put('/', itemController.updateItems)
// router.post('/')
router.put('/:id', itemController.updateItem)

module.exports = router