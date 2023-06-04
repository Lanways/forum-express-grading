const bcrypt = require('bcryptjs')

const { User, Comment, Restaurant, Favorite, Like } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userServices = {
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
  },
  getUser: (req, cb) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Comment.findAll({
        raw: true,
        nest: true,
        where: {
          userId: req.params.id
        },
        include: [Restaurant]
      })
    ])
      .then(([user, comments]) => {
        if (!user) throw new Error(`User didn't exist`)
        user = user.toJSON()
        delete user.password
        return cb(null, { user, comments })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error(`User didn't exist`)
        user = user.toJSON()
        delete user.password
        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const { name } = req.body
    const { file } = req
    if (!name) throw new Error('User name is required')
    return Promise.all([
      User.findByPk(req.user.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        if (user.id !== Number(req.params.id)) throw new Error('Edit self profile only!')
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then((updatedUser) => {
        updatedUser = updatedUser.toJSON()
        delete updatedUser.password
        return cb(null, { updatedUser })
      })
      .catch(err => cb(err))
  },
  addFavorite: (req, cb) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error(`Restaurant didn't exist!`)
        if (favorite) throw new Error(`You have favorited this restaurant!`)

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then((updateFavorite) => cb(null, { updateFavorite }))
      .catch(err => cb(err))
  },
  removeFavorite: (req, cb) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        if (!favorite) throw new Error(`You haven't favorited this restaurant`)
        return favorite.destroy()
      })
      .then((deletedFavorite) => cb(null, { deletedFavorite }))
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const { restaurantId } = req.params

    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error(`Restaurant didn't exist!`)
        if (like) throw new Error(`You have liked this restaurant!`)
        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant")
        return like.destroy()
      })
      .then(() => cb(null))
      .catch(err => cb(err))
  },
}

module.exports = userServices