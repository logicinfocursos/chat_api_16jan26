// Middleware de tratamento de erros
// Captura e formata erros de forma consistente

export function errorHandler(err, req, res, next) {
  console.error('❌ Erro:', err)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Erro interno do servidor'

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: `Rota ${req.method} ${req.path} não encontrada`,
    },
  })
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
