const { User, Restaurant, Comment } = require('../../models')
const commentServices = require('../../services/comment-services')
const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      err ? next(err) : res.redirect(`/restaurant/${data.restaurantId}`, data)
    })
  },
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error(`Comment didn't exist!`)
        return comment.destroy()
      })
      .then(deletedComent => {
        // console.log(deletedComent)
        res.redirect(`/restaurants/${deletedComent.restaurantId}`)
      })
  }
}

module.exports = commentController