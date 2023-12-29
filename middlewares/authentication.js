const { verifToken } = require("../helpers/jwt");
const { User } = require ('../models')

async function authentication(req, res, next) {
  try {
    const bearerToken = req.headers.authorization
    console.log(bearerToken, '>>><<<')
    if(!bearerToken) {
      throw { name : 'Unauthentication1'}
    }

    const token = bearerToken.split(' ')[1]

    const access_token = verifToken(token)

    const findUser = await User.findByPk(access_token.id)
    if(!findUser) {
      throw { name : 'Unauthentication' }
    }

    req.user = {
      id : findUser.id,
      email : findUser.email
    }
    next()
  } catch (error) {
    console.log(error)
  }
}

module.exports = authentication