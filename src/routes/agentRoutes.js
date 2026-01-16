// Rotas de agentes
// Define endpoints para gerenciar agentes de suporte

import express from 'express'
import agentController from '../controllers/agentController.js'

const router = express.Router()

/**
 * @swagger
 * /agents:
 *   post:
 *     summary: Cria um novo agente
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 */
router.post('/', agentController.createAgent)

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Lista todos os agentes
 *     tags: [Agents]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de agentes
 */
router.get('/', agentController.getAllAgents)

/**
 * @swagger
 * /agents/{id}:
 *   get:
 *     summary: Obtém um agente por ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agente encontrado
 */
router.get('/:id', agentController.getAgent)

/**
 * @swagger
 * /agents/{id}:
 *   put:
 *     summary: Atualiza um agente
 *     tags: [Agents]
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
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Agente atualizado
 */
router.put('/:id', agentController.updateAgent)

/**
 * @swagger
 * /agents/{id}/toggle:
 *   patch:
 *     summary: Ativa/desativa um agente
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status do agente alterado
 */
router.patch('/:id/toggle', agentController.toggleAgentStatus)

/**
 * @swagger
 * /agents/{id}:
 *   delete:
 *     summary: Remove um agente
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Agente removido
 */
router.delete('/:id', agentController.deleteAgent)

export default router
