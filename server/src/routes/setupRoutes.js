const express = require('express')
const router = express.Router()
const { createAdmin } = require('../controllers/setupController')

router.post('/admin', createAdmin)

module.exports = router
