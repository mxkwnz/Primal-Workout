const express = require('express')
const router = express.Router()
const { listUsers, createUser, updateUserRole, deleteUser } = require('../controllers/adminController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.use(protect, authorize('admin'))
router.get('/users', listUsers)
router.post('/users', createUser)
router.put('/users/:id/role', updateUserRole)
router.delete('/users/:id', deleteUser)

module.exports = router
