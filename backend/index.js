const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './.env' })
const { verificarUsuario, registrarUsuario, obtenerUsuario } = require('./consultas')
// Middleware para valirdar existencia de token
const { authMiddleware } = require('./middlewares/auth.middleware')
// Middleware para generar reportes a las rutas y consultas
const { generarReportes } = require('./middlewares/generarReportes')

const app = express()
app.use(cors())
app.use(express.json())

app.listen(3000, console.log('Servidor OK'))

// Get para traer informacion del usuario
app.get('/usuarios', authMiddleware, generarReportes, async (req, res) => {
  try {
    const authorization = req.headers.authorization.split(' ')
    const token = authorization[1]
    const { email } = jwt.verify(token, process.env.JWT_SECRET)
    const respuesta = await obtenerUsuario(email)
    res.status(201).json([{
      id: respuesta[0].id,
      email: respuesta[0].email,
      rol: respuesta[0].rol,
      lenguage: respuesta[0].lenguage,
      message: 'Bienvenido'
    }])
  } catch (error) {
    res.status(500).send({ message: 'Datos no encontrados' })
  }
})

// Post para login usuarios
app.post('/login', generarReportes, async (req, res) => {
  try {
    const { email, password } = req.body
    const token = await verificarUsuario(email, password)
    res.status(200).json({ message: 'Token', token })
  } catch (error) {
    res.status(401).json({ message: 'Usuario no encontrado' })
  }
})

// Post registrar usuarios
app.post('/usuarios', generarReportes, async (req, res) => {
  try {
    const usuario = req.body
    const respuesta = await registrarUsuario(usuario)
    res.status(201).json({
      id: respuesta[0].id,
      email: respuesta[0].email,
      message: 'Agregado con exito'
    })
  } catch (error) {
    res.status(500).json({ message: 'Correo ya registrado' })
  }
})
