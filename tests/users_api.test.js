const supertest = require('supertest')
const mongoose = require('mongoose')
const testHelper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = testHelper.users

beforeEach(async () => {
  await User.deleteMany({})
  const promiseArray = initialUsers.map((user) => new User(user).save())
  await Promise.all(promiseArray)
}, 20000)

test('list all users', async () => {
  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(initialUsers.length)

  const expectedUsers = initialUsers.map(({ username, name, _id }) => ({
    username,
    name,
    id: _id,
  }))
  expect(response.body).toMatchObject(expectedUsers)
})

describe('user creation', () => {
  test('new user is successfully created', async () => {
    const newUser = {
      username: 'billy',
      password: 'secret-password',
      name: 'Billy Smith',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterSaving = await testHelper.usersInDb()
    expect(usersAfterSaving).toHaveLength(initialUsers.length + 1)

    expect(response.body).toHaveProperty('username', newUser.username)
    expect(response.body).toHaveProperty('name', newUser.name)
    expect(response.body).toHaveProperty('id')
    expect(response.body).not.toHaveProperty('password')
    expect(response.body).not.toHaveProperty('passwordHash')
  })

  test('require a username', async () => {
    const newUser = {
      password: 'secret-password',
      name: 'Billy Smith',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('error')
  })

  test('require a password', async () => {
    const newUser = {
      username: 'billy',
      name: 'Billy Smith',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('error')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
