const usersRouter = require('express').Router()

usersRouter.post('/', async (request, response, next) => {
  try {
    response.send(`POST /api/users`)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
