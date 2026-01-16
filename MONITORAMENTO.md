# 🔍 Monitoramento do Chat API

A funcionalidade de monitoramento está **ATIVA e FUNCIONANDO**!

## 📍 Localização

### Via Browser (Recomendado)
- **URL Principal**: `http://localhost:3000/monitor`
- **Arquivo local**: `monitor.html` (carrega a página do servidor)

### Via API REST
- **GET** `/api/monitor/stats` - Estatísticas de conexões
- **GET** `/api/monitor/messages` - Histórico de mensagens monitoradas
- **DELETE** `/api/monitor/messages/clear` - Limpar histórico

## 🎯 O que o Monitoramento faz

### 1. Estatísticas em Tempo Real
- Total de conexões WebSocket
- Usuários online
- Agentes online
- Quantidade de mensagens monitoradas

### 2. Monitoramento de Mensagens
Captura **TODAS** as mensagens enviadas:
- Conteúdo completo da mensagem
- Tipo de remetente (user/agent/ai)
- ID da conversa
- Timestamp
- Status de leitura
- Direção (SENT/RECEIVED)
- Ordenação decrescente por data/hora

### 3. Log de Eventos
- Conexões WebSocket
- Desconexões
- Erros
- Eventos do sistema

### 4. Conexões Ativas
- Lista de usuários conectados
- Lista de agentes conectados
- IDs dos sockets

## 🚀 Como usar

### Opção 1: Acessar via Navegador
1. Inicie o servidor: `yarn dev` ou `npm start`
2. Abra no navegador: `http://localhost:3000/monitor`
3. A página atualiza automaticamente a cada 1 segundo

### Opção 2: Usar o arquivo monitor.html
1. Inicie o servidor
2. Abra o arquivo: `monitor.html`
3. A página carrega o monitoramento do servidor

### Opção 3: Via API REST
```bash
# Ver estatísticas
curl http://localhost:3000/api/monitor/stats

# Ver mensagens monitoradas
curl http://localhost:3000/api/monitor/messages

# Limpar histórico
curl -X DELETE http://localhost:3000/api/monitor/messages/clear
```

## 📊 Estrutura das Mensagens Monitoradas

```json
{
  "timestamp": "2026-01-16T21:04:29.339Z",
  "direction": "SENT",
  "conversationId": "751e43b2-d703-4110-87dd-2c0d0f2beb9c",
  "senderType": "user",
  "senderId": "test-monitor-1",
  "content": "Testando monitoramento de mensagens",
  "isRead": false,
  "messageId": "a83a7a86-c399-4a4d-a2bf-3d6f71e2f2f4"
}
```

## 🎨 Visualização na Interface

### Cores por Tipo:
- 🟢 **Usuário**: Borda verde
- 🔵 **Agente**: Borda azul
- 🟡 **IA**: Borda amarela

### Direção:
- **SENT**: Mensagem enviada
- **RECEIVED**: Mensagem recebida

## ⚙️ Configuração

No arquivo `src/services/monitorService.js`:
- `maxMessages: 100` - Limite de mensagens armazenadas
- `isEnabled: true` - Pode ser desativado no `config.json`

No arquivo `config.json`:
```json
{
  "monitoring": {
    "enabled": true,
    "logLevel": "info"
  }
}
```

## 🔧 Arquivos Relacionados

- `src/utils/monitoringPage.js` - Interface HTML do monitoramento
- `src/services/monitorService.js` - Lógica de monitoramento
- `src/routes/monitorRoutes.js` - Endpoints API de monitoramento
- `src/index.js` - Rota `/monitor` configurada

## ✅ Testes Realizados

- [x] Mensagens enviadas via API REST são monitoradas
- [x] Mensagens enviadas via WebSocket são monitoradas
- [x] Ordem decrescente de data/hora mantida
- [x] Limite de 100 mensagens respeitado
- [x] Limpeza de histórico funcional
- [x] Estatísticas atualizadas em tempo real
- [x] Interface responsiva e funcional

## 📝 Diferença entre test-websocket.html e monitor

### test-websocket.html
- **Finalidade**: Testar conexões WebSocket e envio de mensagens
- **Público alvo**: Desenvolvedores testando a API
- **Funcionalidades**: Conectar, enviar mensagens, criar conversas

### monitor (ou monitor.html)
- **Finalidade**: Monitorar o sistema em produção
- **Público alvo**: Administradores e equipe de suporte
- **Funcionalidades**: Ver estatísticas, ver mensagens em tempo real, monitorar conexões

## 🎯 Quando usar o Monitoramento

1. **Durante desenvolvimento**: Para ver se as mensagens estão sendo enviadas corretamente
2. **Em produção**: Para monitorar conversas em tempo real
3. **Para debugging**: Para identificar problemas no fluxo de mensagens
4. **Para suporte**: Para acompanhar conversas dos clientes

## ⚠️ Importante

- As mensagens são armazenadas **apenas na memória** do servidor
- Reiniciar o servidor **limpa o histórico** de mensagens
- Use o endpoint `/api/monitor/messages/clear` para limpar manualmente
- O monitoramento **NÃO** afeta o banco de dados
