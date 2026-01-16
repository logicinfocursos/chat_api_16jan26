// Rotas de mensagens
// Define endpoints para gerenciar mensagens de chat

import express from 'express'
import messageController from '../controllers/messageController.js'

const router = express.Router()

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Cria uma nova mensagem
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               senderType:
 *                 type: string
 *                 enum: [user, agent, ai]
 *               senderId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mensagem criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
router.post('/', messageController.createMessage)

/**
 * @swagger
 * /messages/conversation/{conversationId}:
 *   get:
 *     summary: Lista mensagens de uma conversa
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de mensagens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
router.get(
  '/conversation/:conversationId',
  messageController.getConversationMessages
)

/**
 * @swagger
 * /messages/{messageId}/read:
 *   patch:
 *     summary: Marca uma mensagem como lida
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensagem marcada como lida
 */
router.patch('/:messageId/read', messageController.markAsRead)

/**
 * @swagger
 * /messages/mark-read:
 *   post:
 *     summary: Marca todas as mensagens de uma conversa como lidas
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mensagens marcadas como lidas
 */
router.post('/mark-read', messageController.markConversationAsRead)

/**
 * @swagger
 * /messages/unread:
 *   get:
 *     summary: Conta mensagens não lidas
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: userType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [user, agent]
 *     responses:
 *       200:
 *         description: Quantidade de mensagens não lidas
 */
router.get('/unread', messageController.getUnreadCount)

export default router
