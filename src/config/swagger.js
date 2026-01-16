// Configuração do Swagger para documentação da API
// Define especificações OpenAPI para todos os endpoints

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chat API - E-commerce Support',
      version: '1.0.0',
      description:
        'API para sistema de chat em tempo real de suporte ao cliente',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Conversation: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            agentId: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['open', 'in_progress', 'closed'] },
            subject: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Message: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            conversationId: { type: 'string', format: 'uuid' },
            senderType: { type: 'string', enum: ['user', 'agent', 'ai'] },
            content: { type: 'string' },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}

export default swaggerOptions
