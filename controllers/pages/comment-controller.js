const commentServices = require('../../services/comment-services')
const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      err ? next(err) : res.redirect(`/restaurant/${data.restaurantId}`, data)
    })
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => {
      err ? next(err) : res.redirect(`/restaurants/${data.restaurantId}`, data)
    })
  }
}

module.exports = commentController