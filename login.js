const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

module.exports = () => {
  const routerModel = new SignUpRouter()
  router.post('/signup', ExpressRouterAdapter.adapt(routerModel))
}

class ExpressRouterAdapter {
  static adapt (router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await router.route(httpRequest)
      res.statu(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

// Presentation
// Signup-router
class SignUpRouter {
  async route (httpRequest) {
    const { email, password, repeatPassword } = httpRequest.body
    const user = new SignUpUseCase().signUp(email, password, repeatPassword)
    return {
      statusCode: 200,
      body: user
    }
  }
}

// Domain
// Signup-usecase
class SignUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      return new AddAccountRepository().add(email, password)
    }
  }
}

// Infra
// add-acount-repo
class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
