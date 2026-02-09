const express = require('express')
const router = express.Router()
const { listManagedUsers, setUserPremiumStatus, deleteManagedUser } = require('../controllers/modController')
const { protect, authorize } = require('../middleware/authMiddleware')

router.use(protect, authorize('moderator'))
router.get('/users', listManagedUsers)
router.put('/users/:id/role', setUserPremiumStatus)
router.delete('/users/:id', deleteManagedUser)

module.exports = router
