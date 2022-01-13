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

describe('user login', () => {
  test('successful login', async () => {
    const user = initialUsers[1]
    const login = {
      username: 'mike',
      password: 'mike',
    }

    const response = await api
      .post('/api/login')
      .send(login)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('username', user.username)
    expect(response.body).toHaveProperty('name', user.name)
  })

  describe('invalid logins', () => {
    const invalidLogins = [
      {
        name: 'incorrect username',
        login: { username: 'invalid-username', password: 'mike' },
      },
      {
        name: 'incorrect password',
        login: { username: 'mike', password: 'invalid-password' },
      },
      { name: 'missing username', login: { password: 'missing-username' } },
      { name: 'missing password', login: { username: 'missing-password' } },
    ]
    invalidLogins.forEach(({ name, login }) => {
      test(name, async () => {
        const response = await api
          .post('/api/login')
          .send(login)
          .expect(401)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveProperty('error')
        expect(response.body).not.toHaveProperty('token')
      })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
