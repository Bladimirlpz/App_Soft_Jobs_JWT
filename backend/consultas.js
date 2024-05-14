const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: './.env' })

const pool = new Pool({
  host: process.env.HOST,
  password: process.env.PASSWORD,
  user: process.env.USER,
  database: process.env.DATABASE,
  allowExitOnIdle: true
})

// Funcion para obtener  usuarios
const obtenerUsuario = async () => {
  const consulta = 'SELECT * FROM usuarios;'
  const value = []
  const { rowCount, rows } = await pool.query(consulta, value)
  if (!rowCount) {
    // eslint-disable-next-line no-throw-literal
    throw { code: 204, message: 'Usuario no encontrado' }
  } else {
    return rows
  }
}

// Funcion para autenticacion de usuarios
const verificarUsuario = async (email, password) => {
  const value = [email]
  const consulta = 'SELECT * FROM usuarios WHERE email= $1;'
  const { rows: [usuario], rowCount } = await pool.query(consulta, value)
  const { password: passwordEncriptada } = usuario
  const passwordCorrecta = bcrypt.compareSync(password, passwordEncriptada)
  if (!passwordCorrecta || !rowCount) {
    // eslint-disable-next-line no-throw-literal
    throw { code: 401, message: 'Email o contraseña incorrecta' }
  }
}

// Funcion para registrar usuarios
const registrarUsuario = async (usuario) => {
  let { email, password, rol, lenguage } = usuario
  const passwordEncriptada = bcrypt.hashSync(password)
  password = passwordEncriptada
  const values = [email, passwordEncriptada, rol, lenguage]
  const consulta = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)'
  await pool.query(consulta, values)
}

module.exports = { verificarUsuario, registrarUsuario, obtenerUsuario }
