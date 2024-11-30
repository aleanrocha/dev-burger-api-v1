import * as Yup from 'yup'

import Order from '../schemas/Order'
import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'

class OrderController {
  async store(req, res) {
    try {
      const orderSchema = Yup.object({
        products: Yup.array()
          .required()
          .of(
            Yup.object({
              id: Yup.number().required(),
              quantity: Yup.number().required(),
            }),
          ),
      })

      try {
        orderSchema.validateSync(req.body, { abortEarly: false })
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }

      const { products } = req.body

      const productsIds = products.map((product) => product.id)

      const findProducts = await Product.findAll({
        where: { id: productsIds },
        include: {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      })

      const formatedProducts = findProducts.map((product) => {
        const productIndex = products.findIndex(
          (item) => item.id === product.id,
        )

        const newProduct = {
          id: product.id,
          name: product.name,
          category: product.category.name,
          price: product.price,
          quantity: products[productIndex].quantity,
          url: product.url,
        }
        return newProduct
      })

      const order = {
        user: {
          id: req.userId,
          name: req.userName,
        },
        products: formatedProducts,
        status: 'Pedido realizado',
      }

      const createdOrder = await Order.create(order)

      return res.status(201).json(createdOrder)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }

  async index(_, res) {
    try {
      const orders = await Order.find()
      return res.status(200).json(orders)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }

  async update(req, res) {
    try {
      const orderSchema = Yup.object({
        status: Yup.string().required(),
      })

      try {
        orderSchema.validateSync(req.body, { abortEarly: false })
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json()
      }

      const { id } = req.params
      const { status } = req.body

      try {
        await Order.updateOne({ _id: id }, { status })
      } catch (error) {
        return res.status(400).json({ message: error.message })
      }

      return res.status(200).json({ message: 'Status updated sucessfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }
}

export default new OrderController()
