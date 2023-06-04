const restaurantServices = require('../../services/restaurant-services')


const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
  getDashboard: (req, res, next) => {
    restaurantServices.getDashboard(req, (err, data) => {
      err ? next(err) : res.json({ status: "success", data })
    })
  },
}

module.exports = restaurantController