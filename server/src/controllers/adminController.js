const User = require('../models/User')

const listUsers = async (req, res) => {
  const users = await User.find({ role: { $in: ['user', 'premium', 'moderator'] } })
    .select('-password')
    .populate('selectedPlanId', 'name target difficulty')
  res.json(users)
}

const createUser = async (req, res) => {
  const { username, email, password, role } = req.body
  const allowed = ['user', 'premium', 'moderator']
  if (!username || !email || !password || !allowed.includes(role)) {
    return res.status(400).json({ message: 'Invalid data' })
  }
  const exists = await User.findOne({ $or: [{ email }, { username }] })
  if (exists) return res.status(400).json({ message: 'User with email or username exists' })
  const user = await User.create({ username, email, password, role, profile: {} })
  res.status(201).json({ _id: user._id, username: user.username, email: user.email, role: user.role })
}

const updateUserRole = async (req, res) => {
  const { role } = req.body
  const allowed = ['user', 'premium', 'moderator']
  if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' })
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.role === 'admin') return res.status(403).json({ message: 'Cannot manage admin accounts' })
  user.role = role
  await user.save()
  res.json({ _id: user._id, username: user.username, email: user.email, role: user.role })
}

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin accounts' })
  await user.deleteOne()
  res.json({ message: 'User deleted' })
}

module.exports = { listUsers, createUser, updateUserRole, deleteUser }
