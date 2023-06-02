const bcrypt = require('bcryptjs')

const { User } = require('../models')

const userController = {
  signUp: (req, cb) => {
    if (req.body.password != req.body.passwordCheck) throw new Error('Password do not mathc')

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      })
      .then((user) => {
        user = user.toJSON()
        delete user.password
        return cb(null, { user })
      })
      .catch(err => cb(err))
  }
}

module.exports = userController