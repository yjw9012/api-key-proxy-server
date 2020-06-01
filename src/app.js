require('dotenv').config()
const express = require('express')
const debug = require('debug')('express:server')
const proxies = require('./proxies')
const cors = require('cors');

const app = express()

function notFound(req, res, next) {
  res.status(404)
  const error = new Error('Not Found')
  next(error)
}

// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500)
  res.json({
    message: error.message,
  })
}

app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://video-game-backlog.herokuapp.com'
}))
proxies.forEach(proxy => app.use(proxy))
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => debug(`Listening on port ${port}`))
