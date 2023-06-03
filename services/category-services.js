const { Category } = require('../models')


const categoryServices = {
  getCategories: (req, cb) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      //如果點擊edit，需要使用categoryName
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        return cb(null, { categories, category })
      })
      .catch(err => cb(err))
  },
  postCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required')
    Category.findOne({ where: { name } })
      .then(category => {
        if (category) throw new Error('Category already exist')
        return Category.create({ name })
      })
      .then((newCategory) => cb(null, newCategory))
      .catch(err => cb(err))
  },
}

module.exports = categoryServices