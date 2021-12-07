const config = require('./utils/config')
const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

const server = http.createServer(app)
server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
