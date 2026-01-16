// Middleware de logging de requisições
// Registra informações sobre cada requisição HTTP

export function requestLogger(req, res, next) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const timestamp = new Date().toISOString()

    console.log(
      `📤 [${timestamp}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    )
  })

  next()
}
