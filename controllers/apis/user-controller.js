const userServices = require('../../services/user-services')
const jwt = require('jsonwebtoken')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      err ? next(err) : res.json({ status: 'success', data })
    })
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err) => {
      err ? next(err) : res.json({ status: "success" })
    })
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err) => {
      err ? next(err) : res.json({ status: "success" })
    })
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err) => {
      err ? next(err) : res.json({ status: "success" })
    })
  },
}
module.exports = userController