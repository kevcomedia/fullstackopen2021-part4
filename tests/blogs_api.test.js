const supertest = require('supertest')
const mongoose = require('mongoose')
const testHelper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = testHelper.blogs

beforeEach(async () => {
  await Blog.deleteMany({})
  const promiseArray = initialBlogs.map((blog) => new Blog(blog).save())
  await Promise.all(promiseArray)
}, 20000)

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs have a property "id" instead of "_id"', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  for (const blog of response.body) {
    expect(blog.id).toBeDefined()
    expect(blog._id).toBeUndefined()
  }
})

afterAll(() => {
  mongoose.connection.close()
})
