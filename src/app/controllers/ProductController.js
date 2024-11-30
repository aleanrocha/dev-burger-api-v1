import * as Yup from 'yup'

import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'

class ProductController {
  async store(req, res) {
    try {
      const productSchema = Yup.object({
        name: Yup.string().required(),
        price: Yup.number().required(),
        category_id: Yup.number().required(),
        offer: Yup.boolean(),
      })

      try {
        productSchema.validateSync(req.body, { abortEarly: false })
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json()
      }

      const { filename: path } = req.file
      const { name, price, category_id, offer } = req.body

      const product = await Product.create({
        name,
        price,
        offer,
        category_id,
        path,
      })

      return res
        .status(201)
        .json({ id: product.id, name, price, offer, path, category_id })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }

  async update(req, res) {
    try {
      const productSchema = Yup.object({
        name: Yup.string(),
        price: Yup.number(),
        category_id: Yup.number(),
        offer: Yup.boolean(),
      })

      try {
        productSchema.validateSync(req.body, { abortEarly: false })
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json()
      }

      const { id } = req.params
      const findProduct = await Product.findByPk(id)

      if (!findProduct) {
        return res
          .status(400)
          .json({ error: 'Make sure ID product are correct.' })
      }

      let path

      if (req.file) {
        path = req.file.filename
      }

      const { name, price, category_id, offer } = req.body

      await Product.update(
        {
          name,
          price,
          offer,
          category_id,
          path,
        },
        {
          where: { id },
        },
      )

      return res.status(200).json()
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }

  async index(_, res) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      })
      return res.status(200).json(products)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }
}

export default new ProductController()
