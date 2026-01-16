// Serviço de gerenciamento de usuários conectados
// Mapeia IDs de usuários/agentes aos seus sockets WebSocket

class ConnectionManager {
  constructor() {
    this.userConnections = new Map() // userId -> Set of socketIds
    this.agentConnections = new Map() // agentId -> Set of socketIds
    this.socketToUser = new Map() // socketId -> { id, type }
  }

  addConnection(socketId, userId, type) {
    this.socketToUser.set(socketId, { id: userId, type })

    if (type === 'user') {
      if (!this.userConnections.has(userId)) {
        this.userConnections.set(userId, new Set())
      }
      this.userConnections.get(userId).add(socketId)
    } else if (type === 'agent') {
      if (!this.agentConnections.has(userId)) {
        this.agentConnections.set(userId, new Set())
      }
      this.agentConnections.get(userId).add(socketId)
    }
  }

  removeConnection(socketId) {
    const connection = this.socketToUser.get(socketId)
    if (!connection) return

    const { id, type } = connection

    if (type === 'user') {
      const sockets = this.userConnections.get(id)
      if (sockets) {
        sockets.delete(socketId)
        if (sockets.size === 0) {
          this.userConnections.delete(id)
        }
      }
    } else if (type === 'agent') {
      const sockets = this.agentConnections.get(id)
      if (sockets) {
        sockets.delete(socketId)
        if (sockets.size === 0) {
          this.agentConnections.delete(id)
        }
      }
    }

    this.socketToUser.delete(socketId)
  }

  getUserSockets(userId) {
    return this.userConnections.get(userId) || new Set()
  }

  getAgentSockets(agentId) {
    return this.agentConnections.get(agentId) || new Set()
  }

  isUserOnline(userId) {
    const sockets = this.userConnections.get(userId)
    return sockets && sockets.size > 0
  }

  isAgentOnline(agentId) {
    const sockets = this.agentConnections.get(agentId)
    return sockets && sockets.size > 0
  }

  getOnlineUsers() {
    return Array.from(this.userConnections.keys())
  }

  getOnlineAgents() {
    return Array.from(this.agentConnections.keys())
  }

  getAllConnections() {
    return {
      users: this.getOnlineUsers(),
      agents: this.getOnlineAgents(),
      totalSockets: this.socketToUser.size,
    }
  }
}

export default new ConnectionManager()
