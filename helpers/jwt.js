const jwt = require ('jsonwebtoken')
const JWT_SECRET = 'secret'

const createToken = (data) => {
  return jwt.sign(data, JWT_SECRET)
}

const verifToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}

module.exports = { createToken, verifToken }