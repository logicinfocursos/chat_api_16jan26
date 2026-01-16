// Controller de agentes
// Manipula requisições HTTP relacionadas a agentes de suporte

import agentService from '../services/agentService.js'

export async function createAgent(req, res) {
  try {
    const { email, name } = req.body

    if (!email || !name) {
      return res.status(400).json({ error: 'email e name são obrigatórios' })
    }

    const existingAgent = await agentService.getAgentByEmail(email)
    if (existingAgent) {
      return res.status(409).json({ error: 'Email já cadastrado' })
    }

    const agent = await agentService.createAgent(email, name)

    res.status(201).json(agent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getAgent(req, res) {
  try {
    const { id } = req.params

    const agent = await agentService.getAgentById(id)

    if (!agent) {
      return res.status(404).json({ error: 'Agente não encontrado' })
    }

    res.json(agent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getAllAgents(req, res) {
  try {
    const { active } = req.query

    let agents

    if (active === 'true') {
      agents = await agentService.getActiveAgents()
    } else {
      agents = await agentService.getAllAgents()
    }

    res.json(agents)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateAgent(req, res) {
  try {
    const { id } = req.params
    const { email, name, isActive } = req.body

    const agent = await agentService.updateAgent(id, { email, name, isActive })

    res.json(agent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function toggleAgentStatus(req, res) {
  try {
    const { id } = req.params

    const agent = await agentService.toggleAgentStatus(id)

    res.json(agent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteAgent(req, res) {
  try {
    const { id } = req.params

    await agentService.deleteAgent(id)

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default {
  createAgent,
  getAgent,
  getAllAgents,
  updateAgent,
  toggleAgentStatus,
  deleteAgent,
}
