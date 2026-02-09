const User = require('../models/User')

const seedAdmin = async () => {
  const { ADMIN_SEED, ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env
  if (ADMIN_SEED !== 'true') return
  if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) return
  const existing = await User.findOne({ email: ADMIN_EMAIL })
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin'
      await existing.save()
    }
    return
  }
  await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    profile: {}
  })
}

module.exports = seedAdmin
