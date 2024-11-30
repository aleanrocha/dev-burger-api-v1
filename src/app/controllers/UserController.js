import { v4 } from 'uuid'
import * as Yup from 'yup'

import User from '../models/User'

class UserController {
  async store(req, res) {
    try {
      const userSchema = Yup.object({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
        admin: Yup.boolean(),
      })

      try {
        userSchema.validateSync(req.body, { abortEarly: false })
      } catch (error) {
        return res.status(400).json({ error: error.errors })
      }

      const { name, email, password, admin } = req.body

      const userExists = await User.findOne({ where: { email } })

      if (userExists) {
        return res.status(409).json({ error: 'User already exists!' })
      }

      const user = await User.create({
        id: v4(),
        name,
        email,
        password,
        admin,
      })
      return res.status(201).json({ id: user.id, name, email, admin })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }
}

export default new UserController()
