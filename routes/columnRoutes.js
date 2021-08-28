const express = require('express')
const router = express.Router()
const columnController = require('../controllers/columnController')

router.get('/', columnController.getAllColumns)
// router.post('/')
router.put('/', columnController.updateColumns)
// router.delete('/:id')
router.put('/:id', columnController.updateColumn)

module.exports = router