const Blog = require('../models/blog')
const User = require('../models/user')

const listWithOneBlog = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
]

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

const users = [
  {
    _id: '61c2fad72da881244f4b487b',
    username: 'root',
    // plaintext is "secret"
    passwordHash:
      '$2y$10$LmZ9Z2ClgiBBxFd1fGwwaOjWASIu.RXbduSwXpDV9CT7UFDdr/bT.',
    name: 'superuser',
  },
  {
    _id: '61c2fc0c2da881244f4b487c',
    username: 'mike',
    // plaintext is "mike"
    passwordHash:
      '$2y$10$veFi379jtAlWyCkuqfYo5.jnxo637IhIJ4heUDurgar7OGAwvxzZW',
    name: 'Mike Gomez',
  },
]

const blogsInDb = async () => {
  return await Blog.find({})
}

const usersInDb = async () => {
  return await User.find({})
}

module.exports = { listWithOneBlog, blogs, blogsInDb, users, usersInDb }
