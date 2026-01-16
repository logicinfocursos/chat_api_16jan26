// Controller de usuários
// Manipula requisições HTTP relacionadas a usuários

import userService from '../services/userService.js'

export async function createUser(req, res) {
  try {
    const { email, name } = req.body

    if (!email || !name) {
      return res.status(400).json({ error: 'email e name são obrigatórios' })
    }

    const existingUser = await userService.getUserByEmail(email)
    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' })
    }

    const user = await userService.createUser(email, name)

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getUser(req, res) {
  try {
    const { id } = req.params

    const user = await userService.getUserById(id)

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers()

    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params
    const { email, name } = req.body

    const user = await userService.updateUser(id, { email, name })

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params

    await userService.deleteUser(id)

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export default {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
}
