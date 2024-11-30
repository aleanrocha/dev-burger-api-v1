import { Router } from 'express'
import multer from 'multer'

import authMiddleware from './app/middlewares/auth'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import ProductController from './app/controllers/ProductController'

import multerConfig from './config/multer'
import CategoryController from './app/controllers/CategoryController'
import OrderController from './app/controllers/OrderController'

import CreatePaymentIntentController from './app/controllers/stripe/createPaymentIntentController'

const routes = new Router()

const upload = multer(multerConfig)

routes.get('/', (_, res) => {
  return res.status(200).json({ message: 'OK' })
})

routes.post('/users', UserController.store)
routes.post('/session', SessionController.store)

routes.use(authMiddleware)

routes.get('/products', ProductController.index)
routes.post('/products', upload.single('file'), ProductController.store)
routes.put('/products/:id', upload.single('file'), ProductController.update)

routes.get('/categories', CategoryController.index)
routes.post('/categories', upload.single('file'), CategoryController.store)
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.get('/orders', OrderController.index)
routes.post('/orders', OrderController.store)
routes.put('/orders/:id', OrderController.update)

routes.post('/create-payment-intent', CreatePaymentIntentController.store)

export default routes
