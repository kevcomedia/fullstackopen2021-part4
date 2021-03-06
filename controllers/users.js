const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { likes: 0, user: 0 })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { username, password, name } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password is required and must be at least 3 characters long',
    })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const savedUser = await new User({ username, name, passwordHash }).save()

    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter
