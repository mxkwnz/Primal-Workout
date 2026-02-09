const User = require('../models/User')

const createAdmin = async (req, res) => {
  const token = req.headers['x-setup-token']
  if (!process.env.ADMIN_SETUP_TOKEN || token !== process.env.ADMIN_SETUP_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const existingAdmin = await User.findOne({ role: 'admin' })
  if (existingAdmin) {
    return res.status(409).json({ message: 'Admin already exists' })
  }
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing username, email or password' })
  }
  const dup = await User.findOne({ $or: [{ email }, { username }] })
  if (dup) {
    return res.status(400).json({ message: 'User with given email or username exists' })
  }
  const admin = await User.create({
    username,
    email,
    password,
    role: 'admin',
    profile: {}
  })
  res.status(201).json({ _id: admin._id, username: admin.username, email: admin.email, role: admin.role })
}

module.exports = { createAdmin }
