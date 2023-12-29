const express = require('express')
const Controllers = require('./controllers/controllers')
const authentication = require('./middlewares/authentication')
const VoucherControllers = require('./controllers/voucherController')
const app = express()
const port = 3000
const cors = require ('cors')
const errorHandler = require('./middlewares/errorHandling')


app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.post('/register', Controllers.register)
app.post('/login', Controllers.login)

app.get('/users', Controllers.userAll)

app.use(authentication)
app.get('/vouchers', VoucherControllers.fetchVoucher)
app.get('/gifts', VoucherControllers.fetchGift)
app.patch('/gifts/:id', VoucherControllers.patchGift)
app.patch('/gifts/:id/claim', VoucherControllers.patchGiftClaim)
app.delete('/gifts/:id', VoucherControllers.deleteGift)
app.post('/gifts/:voucherId', VoucherControllers.createGift)


app.use(errorHandler)
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
module.exports = app