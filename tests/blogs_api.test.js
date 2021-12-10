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

test('new blog posts are saved', async () => {
  const newBlog = {
    title: 'New Blog Testing',
    author: 'blogtester',
    url: 'https://example.com/new-blog-testing',
    likes: 3,
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfterSaving = await testHelper.blogsInDb()
  expect(blogsAfterSaving).toHaveLength(initialBlogs.length + 1)

  expect(response.body).toMatchObject(newBlog)
})

test('new blog with no "likes" property defaults to 0 likes', async () => {
  const newBlog = {
    title: 'New Blog Testing',
    author: 'blogtester',
    url: 'https://example.com/new-blog-testing',
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  expect(response.body.likes).toBeDefined()
  expect(response.body.likes).toBe(0)
})

test('api responds with 400 when "title" property is missing', async () => {
  const newBlog = {
    author: 'blogtester',
    url: 'https://example.com/new-blog-testing',
    likes: 3,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('api responds with 400 when "url" property is missing', async () => {
  const newBlog = {
    title: 'New Blog Testing',
    author: 'blogtester',
    likes: 3,
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

describe('deleting a blog', () => {
  test('api responds with 204', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
  })

  test('blog is no longer in database', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

    await api.delete(`/api/blogs/${blogToDelete.id}`)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    expect(blogsAtEnd).not.toContainEqual(blogToDelete)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
