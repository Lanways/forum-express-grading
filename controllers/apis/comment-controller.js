const { User, Restaurant, Comment } = require('../../models')
const commentServices = require('../../services/comment-services')
const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
}

module.exports = commentController