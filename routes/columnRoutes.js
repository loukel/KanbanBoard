const express = require('express')
const router = express.Router()
const columnController = require('../controllers/columnController')

router.get('/', columnController.get_columns)
// router.post('/')
router.put('/', columnController.update_columns)
// router.delete('/:id')
router.put('/:id', columnController.update_column)

module.exports = router