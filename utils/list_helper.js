const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs
    .map(({ title, author, likes }) => ({ title, author, likes }))
    .reduce((currentFavorite, blog) =>
      blog.likes > currentFavorite.likes ? blog : currentFavorite
    )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let blogCounts = _.countBy(blogs, 'author')
  blogCounts = _.toPairs(blogCounts)
  blogCounts = blogCounts.map(([author, blogs]) => ({ author, blogs }))
  const max = _.maxBy(blogCounts, ({ blogs }) => blogs)
  return max
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsByAuthor = _.groupBy(blogs, 'author')
  let authorLikes = _.mapValues(blogsByAuthor, (blogs) =>
    _.sumBy(blogs, 'likes')
  )
  authorLikes = _.toPairs(authorLikes)
  authorLikes = authorLikes.map(([author, likes]) => ({ author, likes }))
  const max = _.maxBy(authorLikes, 'likes')
  return max
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
