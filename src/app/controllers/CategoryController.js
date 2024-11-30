import * as Yup from 'yup'

import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store(req, res) {
    try {
      const categorySchema = Yup.object({
        name: Yup.string().required(),
      })

      try {
        categorySchema.validateSync(req.body, { abortEarly: false })
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json()
      }

      const { filename: path } = req.file
      const { name } = req.body

      const categoryExists = await Category.findOne({ where: { name } })

      if (categoryExists) {
        return res.status(400).json({ error: 'Category already exists!' })
      }

      const category = await Category.create({ name, path })

      return res.status(201).json({ id: category.id, name })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }

  async update(req, res) {
    try {
      const categorySchema = Yup.object({
        name: Yup.string(),
      })

      try {
        categorySchema.validateSync(req.body, { abortEarly: false })
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }

      const { admin: isAdmin } = await User.findByPk(req.userId)

      if (!isAdmin) {
        return res.status(401).json()
      }

      const { id } = req.params
      const findCategory = await Category.findByPk(id)

      if (!findCategory) {
        return res
          .status(400)
          .json({ error: 'Make sure ID product are correct.' })
      }

      let path

      if (req.file) {
        path = req.file.filename
      }

      const { name } = req.body

      if (name) {
        const categoryExists = await Category.findOne({ where: { name } })

        if (categoryExists && categoryExists.id !== +id) {
          return res.status(400).json({ error: 'Category already exists!' })
        }
      }

      await Category.update(
        { name, path },
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
      const categories = await Category.findAll()
      return res.status(200).json(categories)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }
}

export default new CategoryController()
