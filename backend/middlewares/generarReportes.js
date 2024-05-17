const generarReportes = (req, res, next) => {
  const url = req.url
  const query = req.body
  console.log(`Se ha recibido una consulta a la ruta: ${url} de la tabla de usuarios en la base de datos softjobs con los siguientes datos:`, query)

  next()
}

module.exports = { generarReportes }
