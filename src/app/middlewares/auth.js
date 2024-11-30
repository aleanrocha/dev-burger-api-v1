import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth'

const authMiddleware = (req, res, nx) => {
  const authToken = req.headers.authorization

  if (!authToken) {
    return res.status(401).json({ error: 'Token not provided.' })
  }

  const token = authToken.split(' ').at(1)

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error()
      }
      req.userId = decoded.id
      req.userName = decoded.name
    })
  } catch (err) {
    res.status(401).json({ error: 'Token is invalid.' })
  }

  return nx()
}

export default authMiddleware
