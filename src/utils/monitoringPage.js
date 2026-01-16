// Console de monitoramento em tempo real
// Página web para visualizar mensagens e conexões em tempo real

const monitoringPage = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monitoramento Chat API</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #1a1a2e;
      color: #eee;
      padding: 20px;
    }

    .container {
      max-width: 1600px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #00d9ff;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: #16213e;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #00d9ff;
    }

    .stat-card h3 {
      font-size: 14px;
      color: #8892b0;
      margin-bottom: 10px;
    }

    .stat-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #00d9ff;
    }

    .monitor-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    @media (max-width: 1200px) {
      .monitor-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 900px) {
      .monitor-grid {
        grid-template-columns: 1fr;
      }
    }

    .monitor-panel {
      background: #16213e;
      border-radius: 8px;
      overflow: hidden;
      min-height: 600px;
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      background: #0f3460;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-header h2 {
      font-size: 16px;
      color: #00d9ff;
    }

    .clear-btn {
      background: #e94560;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }

    .clear-btn:hover {
      background: #ff6b6b;
    }

    .panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
    }

    .connections-content {
      max-height: 550px;
      overflow-y: auto;
    }

    .connection-item {
      background: #1a1a2e;
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .connection-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00ff88;
    }

    .connection-type {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
      background: #0f3460;
    }

    .connection-id {
      font-size: 12px;
      color: #8892b0;
    }

    .empty-state {
      text-align: center;
      color: #8892b0;
      padding: 40px;
    }

    .message-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .message-item {
      background: #1a1a2e;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid;
    }

    .message-item.user {
      border-color: #00ff88;
    }

    .message-item.agent {
      border-color: #00d9ff;
    }

    .message-item.ai {
      border-color: #ffd93d;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
      color: #8892b0;
    }

    .message-type {
      font-weight: bold;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .message-type.user {
      background: rgba(0, 255, 136, 0.2);
      color: #00ff88;
    }

    .message-type.agent {
      background: rgba(0, 217, 255, 0.2);
      color: #00d9ff;
    }

    .message-type.ai {
      background: rgba(255, 217, 61, 0.2);
      color: #ffd93d;
    }

    .message-direction {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 3px;
      margin-left: 8px;
    }

    .message-direction.SENT {
      background: rgba(0, 255, 136, 0.3);
    }

    .message-direction.RECEIVED {
      background: rgba(255, 107, 107, 0.3);
    }

    .message-conversation {
      font-size: 11px;
      color: #666;
      margin-bottom: 5px;
    }

    .message-content {
      font-size: 14px;
      color: #eee;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .message-timestamp {
      font-size: 11px;
      color: #666;
    }

    .log-entry {
      padding: 8px;
      margin-bottom: 5px;
      border-radius: 4px;
      background: #1a1a2e;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }

    .log-entry.connection {
      border-left: 3px solid #00ff88;
    }

    .log-entry.message {
      border-left: 3px solid #00d9ff;
    }

    .log-entry.error {
      border-left: 3px solid #e94560;
    }

    .log-entry.event {
      border-left: 3px solid #ffd93d;
    }

    .log-entry.disconnection {
      border-left: 3px solid #ff6b6b;
    }

    .log-timestamp {
      color: #8892b0;
      margin-right: 10px;
    }

    .log-type {
      font-weight: bold;
      margin-right: 10px;
    }

    .log-content.connection .log-type {
      color: #00ff88;
    }

    .log-content.message .log-type {
      color: #00d9ff;
    }

    .log-content.error .log-type {
      color: #e94560;
    }

    .log-content.event .log-type {
      color: #ffd93d;
    }

    .log-content.disconnection .log-type {
      color: #ff6b6b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Monitoramento Chat API - Tempo Real</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Conexões</h3>
        <div class="value" id="totalConnections">0</div>
      </div>
      <div class="stat-card">
        <h3>Usuários Online</h3>
        <div class="value" id="onlineUsers">0</div>
      </div>
      <div class="stat-card">
        <h3>Agentes Online</h3>
        <div class="value" id="onlineAgents">0</div>
      </div>
      <div class="stat-card">
        <h3>Mensagens</h3>
        <div class="value" id="messageCount">0</div>
      </div>
    </div>

    <div class="monitor-grid">
      <div class="monitor-panel">
        <div class="panel-header">
          <h2>💬 Mensagens</h2>
          <button class="clear-btn" onclick="clearMessages()">Limpar</button>
        </div>
        <div class="panel-content" id="messagesPanel">
          <div class="empty-state">Aguardando mensagens...</div>
        </div>
      </div>

      <div class="monitor-panel">
        <div class="panel-header">
          <h2>📋 Log de Eventos</h2>
          <button class="clear-btn" onclick="clearLogs()">Limpar Logs</button>
        </div>
        <div class="panel-content" id="logContent"></div>
      </div>

      <div class="monitor-panel">
        <div class="panel-header">
          <h2>👥 Conexões Ativas</h2>
        </div>
        <div class="panel-content connections-content" id="connectionsContent">
          <div class="empty-state">Nenhuma conexão ativa</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    let eventCount = 0

    function updateStats(stats) {
      document.getElementById('totalConnections').textContent = stats.totalSockets
      document.getElementById('onlineUsers').textContent = stats.users.length
      document.getElementById('onlineAgents').textContent = stats.agents.length
    }

    function displayMessages(messages) {
      const messagesPanel = document.getElementById('messagesPanel')

      if (messages.length === 0) {
        messagesPanel.innerHTML = '<div class="empty-state">Aguardando mensagens...</div>'
        document.getElementById('messageCount').textContent = '0'
        return
      }

      document.getElementById('messageCount').textContent = messages.length

      const messageList = document.createElement('div')
      messageList.className = 'message-list'

      messages.forEach(function (msg) {
        const item = document.createElement('div')
        item.className = 'message-item ' + msg.senderType

        const timestamp = new Date(msg.timestamp).toLocaleString('pt-BR')

        item.innerHTML = 
          '<div class="message-header">' +
            '<span>' +
              '<span class="message-type ' + msg.senderType + '">' + msg.senderType + '</span>' +
              '<span class="message-direction ' + msg.direction + '">' + msg.direction + '</span>' +
            '</span>' +
            '<span class="message-timestamp">' + timestamp + '</span>' +
          '</div>' +
          '<div class="message-conversation">Conversa: ' + msg.conversationId.substring(0, 8) + '...</div>' +
          '<div class="message-content">' + msg.content + '</div>'

        messageList.appendChild(item)
      })

      messagesPanel.innerHTML = ''
      messagesPanel.appendChild(messageList)
    }

    function addLogEntry(entry) {
      const logContent = document.getElementById('logContent')
      const logEntry = document.createElement('div')
      logEntry.className = 'log-entry ' + entry.type.toLowerCase()

      const timestamp = new Date(entry.timestamp).toLocaleTimeString('pt-BR')

      logEntry.innerHTML = 
        '<span class="log-timestamp">' + timestamp + '</span>' +
        '<span class="log-type">[' + entry.type + ']</span>' +
        '<span>' + (entry.message || JSON.stringify(entry)) + '</span>'

      logContent.appendChild(logEntry)
      logContent.scrollTop = logContent.scrollHeight

      eventCount++
    }

    function updateConnections(connections) {
      const connectionsContent = document.getElementById('connectionsContent')

      if (connections.users.length === 0 && connections.agents.length === 0) {
        connectionsContent.innerHTML = '<div class="empty-state">Nenhuma conexão ativa</div>'
        return
      }

      connectionsContent.innerHTML = ''

      connections.users.forEach(function (userId) {
        const item = document.createElement('div')
        item.className = 'connection-item'
        item.innerHTML = 
          '<div class="connection-info">' +
            '<div class="status-dot"></div>' +
            '<span class="connection-id">' + userId + '</span>' +
            '<span class="connection-type">USUÁRIO</span>' +
          '</div>'
        connectionsContent.appendChild(item)
      })

      connections.agents.forEach(function (agentId) {
        const item = document.createElement('div')
        item.className = 'connection-item'
        item.innerHTML = 
          '<div class="connection-info">' +
            '<div class="status-dot"></div>' +
            '<span class="connection-id">' + agentId + '</span>' +
            '<span class="connection-type">AGENTE</span>' +
          '</div>'
        connectionsContent.appendChild(item)
      })
    }

    async function clearMessages() {
      try {
        await fetch('/api/monitor/messages/clear', { method: 'DELETE' })
        document.getElementById('messagesPanel').innerHTML = '<div class="empty-state">Histórico limpo</div>'
        document.getElementById('messageCount').textContent = '0'
      } catch (error) {
        console.error('Erro ao limpar mensagens:', error)
      }
    }

    function clearLogs() {
      document.getElementById('logContent').innerHTML = ''
      eventCount = 0
    }

    function startMonitoring() {
      setInterval(async function () {
        try {
          const statsResponse = await fetch('/api/monitor/stats')
          const stats = await statsResponse.json()
          updateStats(stats)
          updateConnections(stats)
        } catch (error) {
          console.error('Erro ao buscar estatísticas:', error)
        }

        try {
          const messagesResponse = await fetch('/api/monitor/messages')
          const messages = await messagesResponse.json()
          displayMessages(messages)
        } catch (error) {
          console.error('Erro ao buscar mensagens:', error)
        }
      }, 1000)

      addLogEntry({
        type: 'EVENT',
        timestamp: new Date().toISOString(),
        message: 'Monitoramento iniciado',
      })
    }

    startMonitoring()
  </script>
</body>
</html>
`

export function getMonitoringPage() {
  return monitoringPage
}
