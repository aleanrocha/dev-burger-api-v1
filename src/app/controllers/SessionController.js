import * as Yup from 'yup'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import authConfig from '../../config/auth'

class SessionController {
  async store(req, res) {
    try {
      const sessionSchema = Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
      })

      const isValid = await sessionSchema.isValid(req.body)

      const emailOrPasswordIncorrect = () => {
        res
          .status(401)
          .json({ error: 'Make sure your email or password are correct.' })
      }

      if (!isValid) {
        return emailOrPasswordIncorrect()
      }

      const { email, password } = req.body

      const user = await User.findOne({ where: { email } })

      if (!user) {
        return emailOrPasswordIncorrect()
      }

      const isSamePassword = await user.checkPassword(password)

      if (!isSamePassword) {
        return emailOrPasswordIncorrect()
      }

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email,
        admin: user.admin,
        token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error!' })
    }
  }
}

export default new SessionController()
