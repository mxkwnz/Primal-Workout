const User = require('../models/User')

const listManagedUsers = async (req, res) => {
  const users = await User.find({ role: { $in: ['user', 'premium'] } }).select('-password')
  res.json(users)
}

const setUserPremiumStatus = async (req, res) => {
  const { role } = req.body
  if (!['user', 'premium'].includes(role)) return res.status(400).json({ message: 'Invalid role for moderator' })
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (!['user', 'premium'].includes(user.role)) return res.status(403).json({ message: 'Moderator cannot manage this role' })
  user.role = role
  await user.save()
  res.json({ _id: user._id, username: user.username, email: user.email, role: user.role })
}

const deleteManagedUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (!['user', 'premium'].includes(user.role)) return res.status(403).json({ message: 'Moderator cannot delete this role' })
  await user.deleteOne()
  res.json({ message: 'User deleted' })
}

module.exports = { listManagedUsers, setUserPremiumStatus, deleteManagedUser }
