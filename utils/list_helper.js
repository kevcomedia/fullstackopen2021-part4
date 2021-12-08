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
  return null
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }
