const { comparePassoword } = require("../helpers/bcryptjs");
const { createToken } = require("../helpers/jwt");
const { User } = require("../models");

class Controllers {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const newUser = await User.create({ email, password });

      if(email === 'UniqueConstraintError'){
        throw { name: "UniqueConstraintError"}
      }

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
      });
    } catch (error) {
      console.log(error.errors[0].message, '>>>')
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const findUser = await User.findOne({
        where: { email }
      });
      if (!findUser) {
        throw { name: "Email/Password Is Wrong" };
      }

      const checkPassword = comparePassoword(password, findUser.password)
      if(!checkPassword) {
        throw { name : "Email/Password Is Wrong" }
      }

      const access_token = createToken({
        id: findUser.id
      })
      res.status(200).json({access_token})
    } catch (error) {
      next(error)
    }
  }

  static async userAll(req, res, next) {
    try {
      const data = await User.findAll()
      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controllers;
