const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { verificarUsuario, registrarUsuario, obtenerUsuario } = require('./consultas')

const app = express()
app.use(cors())
app.use(express.json())

app.listen(3000, console.log('Servidor OK'))

// Get para traer informacion del usuario
app.get('/usuarios', async (req, res) => {
  try {
    const usuario = await obtenerUsuario()
    res.json(usuario)
  } catch (error) {
    res.status(204).send('Datos no encontrados')
  }
})

// Post para login usuarios
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    await verificarUsuario(email, password)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10h' })
    res.send(token)
  } catch (error) {
    res.status(500).send('Usuario o contraseña incorrecta')
  }
})

// Post registrar usuarios
app.post('/usuarios', async (req, res) => {
  try {
    const usuario = req.body
    await registrarUsuario(usuario)
    res.send('Usuario creado con exito')
  } catch (error) {
    res.status(500).send('Error al registrar')
  }
})
