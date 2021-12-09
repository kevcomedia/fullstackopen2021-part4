const testHelper = require('./test_helper')
const listHelper = require('../utils/list_helper')

const { listWithOneBlog, blogs } = testHelper

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(7)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(blogs)).toBe(36)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    expect(listHelper.favoriteBlog([])).toBe(null)
  })

  test('of list with one blog is the blog itself', () => {
    expect(listHelper.favoriteBlog(listWithOneBlog)).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('of list of blogs is the blog with most likes', () => {
    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })

  test('of list of blogs with more than one top favorite is the first in the list', () => {
    const blogsWithMultipleTop = [
      {
        title: 'Test blog',
        author: 'Billy Smith',
        url: 'https://billysblog.com/test-blog',
        likes: 12,
        __v: 0,
      },
      ...blogs,
    ]
    expect(listHelper.favoriteBlog(blogsWithMultipleTop)).toEqual({
      title: 'Test blog',
      author: 'Billy Smith',
      likes: 12,
    })
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    expect(listHelper.mostBlogs([])).toBe(null)
  })

  test('of list with one blog is author name and one blog', () => {
    expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
      author: 'Michael Chan',
      blogs: 1,
    })
  })

  test('of list of blogs is author with most blogs', () => {
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('of list of blogs with multiple top bloggers is first author in list', () => {
    const blogsWithMultipleTop = [
      {
        title: 'Test blog',
        author: 'Edsger W. Dijkstra',
        url: 'https://example.com/example-blog',
        likes: 12,
        __v: 0,
      },
      ...blogs,
    ]
    expect(listHelper.mostBlogs(blogsWithMultipleTop)).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 3,
    })
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    expect(listHelper.mostLikes([])).toBe(null)
  })

  test('of list with one blog is author name and blog likes', () => {
    expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('of list of blogs is author with most likes', () => {
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('of list of blogs with multiple top bloggers is first author in list', () => {
    const blogsWithMultipleTop = [
      {
        title: 'Test blog',
        author: 'Michael Chan',
        url: 'https://example.com/example-blog',
        likes: 10,
        __v: 0,
      },
      ...blogs,
    ]
    expect(listHelper.mostLikes(blogsWithMultipleTop)).toEqual({
      author: 'Michael Chan',
      likes: 17,
    })
  })
})
