// Rotas de conversas
// Define endpoints para gerenciar conversas de chat

import express from 'express'
import conversationController from '../controllers/conversationController.js'

const router = express.Router()

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Cria uma nova conversa
 *     tags: [Conversations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       201:
 *         description: Conversa criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 */
router.post('/', conversationController.createConversation)

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Lista todas as conversas
 *     tags: [Conversations]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, in_progress, closed]
 *     responses:
 *       200:
 *         description: Lista de conversas
 */
router.get('/', conversationController.getAllConversations)

/**
 * @swagger
 * /conversations/user/{userId}:
 *   get:
 *     summary: Lista conversas de um usuário
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de conversas do usuário
 */
router.get('/user/:userId', conversationController.getUserConversations)

/**
 * @swagger
 * /conversations/{id}:
 *   get:
 *     summary: Obtém uma conversa por ID
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Conversation'
 */
router.get('/:id', conversationController.getConversation)

/**
 * @swagger
 * /conversations/{id}/status:
 *   patch:
 *     summary: Atualiza o status de uma conversa
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, closed]
 *     responses:
 *       200:
 *         description: Status atualizado
 */
router.patch('/:id/status', conversationController.updateConversationStatus)

/**
 * @swagger
 * /conversations/assign:
 *   post:
 *     summary: Atribui um agente a uma conversa
 *     tags: [Conversations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *               agentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversa atribuída
 */
router.post('/assign', conversationController.assignAgent)

export default router
