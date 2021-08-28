const express = require('express')
const router = express.Router()
const itemController = require('../controllers/itemController')

router.put('/', itemController.update_items)
// router.post('/')
router.put('/:id', itemController.update_item)

module.exports = router