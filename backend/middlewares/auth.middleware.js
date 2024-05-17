require('dotenv').config({ path: './middleware/.env' })
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    res.status(401).json({ erro: 'No se encontro el token' })
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch (error) {
    return res.status(401).send({ error: 'Token Invalido' })
  }
}

module.exports = { authMiddleware }
