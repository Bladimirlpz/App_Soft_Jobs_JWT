const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './.env' })

const pool = new Pool({
  host: process.env.HOST,
  password: process.env.PASSWORD,
  user: process.env.USER,
  database: process.env.DATABASE,
  allowExitOnIdle: true
})

// Funcion para obtener  usuarios
const obtenerUsuario = async (email) => {
  const value = [email]
  const consulta = 'SELECT * FROM usuarios WHERE email = $1;'
  const { rows } = await pool.query(consulta, value)
  return rows
}

// Funcion para autenticacion de usuarios
const verificarUsuario = async (email, password) => {
  const value = [email]
  const consulta = 'SELECT * FROM usuarios WHERE email= $1;'
  const { rows: [usuario], rowCount } = await pool.query(consulta, value)
  const { password: passwordEncriptada } = usuario
  const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada)
  if (!passwordCorrecta || !rowCount) {
    throw new Error('Contraseña incorrecta')
  }
  const token = jwt.sign({ email: usuario.email, rol: usuario.rol, lenguage: usuario.lenguage }, process.env.JWT_SECRET, { expiresIn: '10h' })
  return token
}

// Funcion para registrar usuarios
const registrarUsuario = async (usuario) => {
  let { email, password, rol, lenguage } = usuario
  const passwordEncriptada = bcrypt.hashSync(password)
  password = passwordEncriptada
  const values = [email, passwordEncriptada, rol, lenguage]
  const consulta = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4) RETURNING *;'
  const { rows } = await pool.query(consulta, values)
  return rows
}

module.exports = { verificarUsuario, registrarUsuario, obtenerUsuario }
