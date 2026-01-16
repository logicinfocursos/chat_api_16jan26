// Rotas de monitoramento
// Define endpoints para monitoramento da API em tempo real

import express from 'express'
import webSocketService from '../services/webSocketService.js'
import monitorService from '../services/monitorService.js'

const router = express.Router()

/**
 * @swagger
 * /monitor/stats:
 *   get:
 *     summary: Obtém estatísticas de conexões WebSocket
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Estatísticas de conexões
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                 agents:
 *                   type: array
 *                   items:
 *                     type: string
 *                 totalSockets:
 *                   type: number
 */
router.get('/stats', (req, res) => {
  const stats = webSocketService.getConnectionStats()
  res.json(stats)
})

/**
 * @swagger
 * /monitor/messages:
 *   get:
 *     summary: Obtém histórico de mensagens monitoradas
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Lista de mensagens em ordem decrescente de data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   direction:
 *                     type: string
 *                     enum: [SENT, RECEIVED]
 *                   conversationId:
 *                     type: string
 *                   senderType:
 *                     type: string
 *                     enum: [user, agent, ai]
 *                   content:
 *                     type: string
 *                   isRead:
 *                     type: boolean
 */
router.get('/messages', (req, res) => {
  const messages = monitorService.getMessages()
  res.json(messages)
})

/**
 * @swagger
 * /monitor/messages/clear:
 *   delete:
 *     summary: Limpa o histórico de mensagens monitoradas
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Histórico limpo
 */
router.delete('/messages/clear', (req, res) => {
  monitorService.clearMessages()
  res.json({ message: 'Histórico de mensagens limpo' })
})

export default router
