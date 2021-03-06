const supertest = require('supertest')
const mongoose = require('mongoose')
const testHelper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = testHelper.blogs
const initialUsers = testHelper.users

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

describe('new blog posts', () => {
  let bearer
  const user = initialUsers[1]

  beforeEach(async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: user.username, password: 'mike' })
    bearer = `Bearer ${loginResponse.body.token}`
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
      .set('Authorization', bearer)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterSaving = await testHelper.blogsInDb()
    expect(blogsAfterSaving).toHaveLength(initialBlogs.length + 1)

    expect(response.body).toMatchObject(newBlog)
    expect(response.body).toHaveProperty('user', user._id)
  })

  test('new blog with no "likes" property defaults to 0 likes', async () => {
    const newBlog = {
      title: 'New Blog Testing',
      author: 'blogtester',
      url: 'https://example.com/new-blog-testing',
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', bearer)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toBe(0)
  })

  test('api responds with 401 when Authorization is missing', async () => {
    const newBlog = {
      title: 'New Blog Testing',
      author: 'blogtester',
      url: 'https://example.com/new-blog-testing',
      likes: 3,
    }
    await api
      .post('/api/blogs')
      // no Authorization header set
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAfterSaving = await testHelper.blogsInDb()
    expect(blogsAfterSaving).toHaveLength(initialBlogs.length)
  })

  test('api responds with 401 when Authorization is invalid', async () => {
    const newBlog = {
      title: 'New Blog Testing',
      author: 'blogtester',
      url: 'https://example.com/new-blog-testing',
      likes: 3,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer invalid-token')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAfterSaving = await testHelper.blogsInDb()
    expect(blogsAfterSaving).toHaveLength(initialBlogs.length)
  })

  test('api responds with 400 when "title" property is missing', async () => {
    const newBlog = {
      author: 'blogtester',
      url: 'https://example.com/new-blog-testing',
      likes: 3,
    }
    await api
      .post('/api/blogs')
      .set('Authorization', bearer)
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
      .set('Authorization', bearer)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

describe('updating a blog', () => {
  test('api responds with updated blog', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToUpdate = blogsAtStart[blogsAtStart.length - 1]

    const { title, author, url } = blogToUpdate
    const update = {
      title,
      author,
      url,
      likes: blogToUpdate.likes + 200,
    }

    const result = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(update)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    expect(blogsAtEnd).not.toContainEqual(blogToUpdate)

    expect(result.body.likes).toBe(blogToUpdate.likes + 200)
  })

  test('api responds with 400 when id is invalid', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const invalidUpdate = {
      id: 'xyz',
      title: 'test',
      author: 'test author',
      url: 'https://example.com/test-url',
      likes: 100,
    }
    await api
      .put(`/api/blogs/${invalidUpdate.id}`)
      .send(invalidUpdate)
      .expect(400)
    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toEqual(blogsAtStart)
  })
})

describe('deleting a blog', () => {
  let bearer
  const user = initialUsers[1]

  beforeEach(async () => {
    const loginResponse = await api
      .post('/api/login')
      .send({ username: user.username, password: 'mike' })
    bearer = `Bearer ${loginResponse.body.token}`
  })

  test('api responds with 204', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToDelete = initialBlogs[1] // blog submitted by the test user

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', bearer)
      .expect(204)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const blogsAtEndIds = blogsAtEnd.map((blog) => blog.id.toString())
    expect(blogsAtEndIds).not.toContain(blogToDelete._id.toString())
  })

  test('api responds with 401 when Authorization is missing', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToDelete = initialBlogs[1] // blog submitted by the test user

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      // no Authorization header set
      .expect(401)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const blogsAtEndIds = blogsAtEnd.map((blog) => blog.id.toString())
    expect(blogsAtEndIds).toContain(blogToDelete._id.toString())
  })

  test('api responds with 401 when Authorization is invalid', async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToDelete = initialBlogs[1] // blog submitted by the test user

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', 'invalid-token')
      .expect(401)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const blogsAtEndIds = blogsAtEnd.map((blog) => blog.id.toString())
    expect(blogsAtEndIds).toContain(blogToDelete._id.toString())
  })

  test("api responds with 401 when deleting another user's blog", async () => {
    const blogsAtStart = await testHelper.blogsInDb()
    const blogToDelete = initialBlogs[2] // blog NOT submitted by the test user

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', bearer)
      .expect(401)

    const blogsAtEnd = await testHelper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const blogsAtEndIds = blogsAtEnd.map((blog) => blog.id.toString())
    expect(blogsAtEndIds).toContain(blogToDelete._id.toString())
  })
})

afterAll(() => {
  mongoose.connection.close()
})
