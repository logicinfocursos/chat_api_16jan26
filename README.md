# Chat API - Sistema de Suporte em Tempo Real

API completa para sistema de chat em tempo real.

repositório: [https://github.com/logicinfocursos/chat_api_16jan26.git](https://github.com/logicinfocursos/chat_api_16jan26.git)

# Telas do projeto
<img src="https://github.com/logicinfocursos/chat_api_16jan26/blob/main/assets/images/monitoramento.jpg?raw=true"/>
<img src="https://github.com/logicinfocursos/chat_api_16jan26/blob/main/assets/images/monitoramento2.jpg?raw=true"/>
<img src="https://github.com/logicinfocursos/chat_api_16jan26/blob/main/assets/images/sendmensageTest.jpg?raw=true"/>
<img src="https://github.com/logicinfocursos/chat_api_16jan26/blob/main/assets/images/testCors.jpg?raw=true"/>

## 📋 Requisitos

- Node.js 18+
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd chatapi
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key-change-in-production
WS_PATH=/socket.io
```

4. Gere o cliente Prisma e crie o banco de dados:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Inicie o servidor:

```bash
npm start
```

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

## 📚 Documentação

Acesse a documentação Swagger em: `http://localhost:3000/api-docs`

A documentação Swagger fornece uma interface interativa para testar todos os endpoints da API diretamente do navegador, com exemplos de requisições e respostas.

## 🔍 Monitoramento

Acesse o console de monitoramento em tempo real em: `http://localhost:3000/monitor`

### Monitoramento Standalone

Para monitoramento remoto ou sem dependência da API, use o arquivo `monitor-standalone.html`:

1. Abra o arquivo `monitor-standalone.html` no navegador
2. Configure a URL da API no campo fornecido
3. Visualize estatísticas em tempo real de conexões, usuários online e mensagens

## 🔌 WebSocket

Conecte ao WebSocket em: `ws://localhost:3000/socket.io`

### Como iniciar o WebSocket

O WebSocket é iniciado automaticamente ao iniciar o servidor. Não é necessário nenhuma configuração adicional.

### Testando o WebSocket

Use o arquivo `test-websocket.html` para testar as funcionalidades do WebSocket:

1. Abra o arquivo `test-websocket.html` no navegador
2. Escolha o tipo de conexão (Usuário ou Agente)
3. Insira o ID correspondente
4. Clique em "Conectar"
5. Após conectar, você pode:
   - Enviar mensagens
   - Carregar conversas existentes
   - Visualizar o histórico de mensagens em tempo real

## ❤️ Health Check

Verifique o status da API:

```bash
curl http://localhost:3000/
```

Resposta esperada:

```json
{
  "name": "Chat API",
  "version": "1.0.0",
  "description": "API para sistema de chat em tempo real",
  "documentation": "/api-docs",
  "monitoring": "/monitor",
  "websocket": "/socket.io"
}
```

## 📝 Exemplos de CRUD

### Usuários

**Criar usuário:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@example.com", "name": "João Silva"}'
```

**Listar usuários:**

```bash
curl http://localhost:3000/api/users
```

**Obter usuário por ID:**

```bash
curl http://localhost:3000/api/users/{id}
```

**Atualizar usuário:**

```bash
curl -X PUT http://localhost:3000/api/users/{id} \
  -H "Content-Type: application/json" \
  -d '{"email": "novo-email@example.com", "name": "Novo Nome"}'
```

**Deletar usuário:**

```bash
curl -X DELETE http://localhost:3000/api/users/{id}
```

### Agentes

**Criar agente:**

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"email": "agente@example.com", "name": "Maria Souza"}'
```

**Listar agentes:**

```bash
curl http://localhost:3000/api/agents
```

**Listar apenas agentes ativos:**

```bash
curl "http://localhost:3000/api/agents?active=true"
```

**Obter agente por ID:**

```bash
curl http://localhost:3000/api/agents/{id}
```

**Atualizar agente:**

```bash
curl -X PUT http://localhost:3000/api/agents/{id} \
  -H "Content-Type: application/json" \
  -d '{"email": "novo-agente@example.com", "name": "Novo Agente", "isActive": true}'
```

**Ativar/Desativar agente:**

```bash
curl -X PATCH http://localhost:3000/api/agents/{id}/toggle
```

**Deletar agente:**

```bash
curl -X DELETE http://localhost:3000/api/agents/{id}
```

### Conversas

**Criar conversa:**

```bash
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-123", "subject": "Dúvida sobre produto"}'
```

**Listar todas as conversas:**

```bash
curl http://localhost:3000/api/conversations
```

**Listar conversas por status:**

```bash
curl "http://localhost:3000/api/conversations?status=open"
```

**Listar conversas de um usuário:**

```bash
curl http://localhost:3000/api/conversations/user/{userId}
```

**Obter conversa por ID:**

```bash
curl http://localhost:3000/api/conversations/{id}
```

**Atualizar status da conversa:**

```bash
curl -X PATCH http://localhost:3000/api/conversations/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

Status disponíveis: `open`, `in_progress`, `closed`

**Atribuir agente a uma conversa:**

```bash
curl -X POST http://localhost:3000/api/conversations/assign \
  -H "Content-Type: application/json" \
  -d '{"conversationId": "conv-id-123", "agentId": "agent-id-456"}'
```

### Mensagens

Para operações com mensagens (criar, listar, marcar como lida), consulte a documentação Swagger em `http://localhost:3000/api-docs` ou verifique a seção de eventos WebSocket acima.

> **Nota**: Todas as rotas podem ser acessadas com ou sem o prefixo `/api`. Por exemplo: `/users` ou `/api/users`

### Eventos WebSocket

#### Cliente → Servidor:

- **create_conversation**: Cria uma nova conversa

  ```javascript
  socket.emit('create_conversation', { subject: 'Minha dúvida' })
  ```

- **send_message**: Envia uma mensagem

  ```javascript
  socket.emit('send_message', {
    conversationId: 'uuid',
    content: 'Olá, preciso de ajuda',
  })
  ```

- **get_conversations**: Obtém conversas (usuário) ou todas (agente)

  ```javascript
  socket.emit('get_conversations')
  ```

- **assign_conversation** (apenas agente): Atribui uma conversa ao agente

  ```javascript
  socket.emit('assign_conversation', {
    conversationId: 'uuid',
  })
  ```

- **get_active_users** (apenas agente): Obtém lista de usuários online
  ```javascript
  socket.emit('get_active_users')
  ```

#### Servidor → Cliente:

- **connected**: Conexão estabelecida
- **conversation_created**: Nova conversa criada
- **message_sent**: Mensagem enviada com sucesso
- **new_message**: Nova mensagem recebida
- **conversation_assigned**: Conversa atribuída a um agente
- **conversation_updated**: Status da conversa atualizado
- **active_users**: Lista de usuários online
- **error**: Erro ocorrido
- **conversations**: Lista de conversas

### Autenticação WebSocket

Ao conectar, forneça as credenciais:

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    type: 'user', // ou 'agent'
    id: 'user-id', // ou 'agent-id'
  },
})
```

## 🏗️ Estrutura do Projeto

```
src/
├── config/           # Configurações (env, swagger, database)
├── controllers/       # Controllers HTTP
├── middlewares/      # Middlewares (erro, logging)
├── routes/           # Rotas da API
├── services/         # Serviços de negócio (chat, websocket, monitoramento)
├── utils/            # Utilitários
└── index.js          # Ponto de entrada
```

## 🔧 Configuração

As configurações não sensíveis estão no arquivo `config.json` e podem ser alteradas em tempo de execução:

```json
{
  "server": {
    "port": 3000,
    "host": "localhost"
  },
  "websocket": {
    "cors": {
      "origin": "*",
      "methods": ["GET", "POST"]
    },
    "pingTimeout": 60000,
    "pingInterval": 25000
  },
  "chat": {
    "maxMessageLength": 5000,
    "inactiveTimeout": 300000,
    "autoCloseInactiveChats": true
  },
  "monitoring": {
    "enabled": true,
    "logLevel": "info"
  }
}
```

## 🤖 Integração com IA

A API está preparada para receber respostas de agentes de IA. Para implementar:

1. Crie um novo serviço em `src/services/aiService.js`
2. Adicione o senderType `ai` nas mensagens
3. Implemente o webhook que receberá as perguntas e retornará as respostas

## 📊 Monitoramento

O sistema possui um console de monitoramento em tempo real acessível em `/monitor` que exibe:

- Conexões WebSocket ativas
- Usuários e agentes online
- Log de todos os eventos (mensagens, conexões, desconexões, erros)
- Estatísticas em tempo real

## 🧪 Scripts Disponíveis

```bash
npm start                 # Inicia o servidor
npm run dev               # Inicia com auto-reload
npm run prisma:generate   # Gera cliente Prisma
npm run prisma:migrate    # Executa migrações
npm run prisma:studio     # Abre Prisma Studio (interface visual do banco)
```

## 🧪 Ferramentas de Teste

O projeto inclui ferramentas HTML para facilitar os testes:

### test-websocket.html

Interface completa para testar conexões WebSocket:

- Conexão como usuário ou agente
- Envio de mensagens em tempo real
- Visualização do histórico de mensagens
- Carregamento e seleção de conversas

### monitor-standalone.html

Monitoramento remoto independente:

- Configuração de URL da API
- Estatísticas de conexões em tempo real
- Lista de usuários e agentes online
- Histórico de mensagens

### monitor.html

Monitoramento integrado (disponível em `/monitor`)

- Console de monitoramento em tempo real
- Estatísticas e logs do sistema
- Visualização de mensagens
- Controle de limpeza de histórico

## 🔌 WebSocket - Detalhes

O WebSocket é iniciado automaticamente junto com o servidor Express. Não há necessidade de configurações adicionais.

Bibliotecas recomendadas para integração:

- JavaScript: `socket.io-client`
- React: `socket.io-client-react`
- Outras linguagens: consulte a documentação oficial do Socket.IO

## 🔄 Fluxo de Trabalho Típico

1. **Crie um usuário:**

   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"email": "cliente@example.com", "name": "Cliente"}'
   ```

2. **Crie um agente:**

   ```bash
   curl -X POST http://localhost:3000/api/agents \
     -H "Content-Type: application/json" \
     -d '{"email": "suporte@example.com", "name": "Agente Suporte"}'
   ```

3. **Crie uma conversa:**

   ```bash
   curl -X POST http://localhost:3000/api/conversations \
     -H "Content-Type: application/json" \
     -d '{"userId": "id-do-usuario", "subject": "Preciso de ajuda"}'
   ```

4. **Conecte via WebSocket** (usando test-websocket.html ou sua aplicação):

   ```javascript
   const socket = io('http://localhost:3000', {
     auth: {
       type: 'user',
       id: 'id-do-usuario',
     },
   })
   ```

5. **Envie mensagens** em tempo real!

## 🔐 Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3000)
- `NODE_ENV`: Ambiente (development/production)
- `DATABASE_URL`: URL do banco de dados SQLite
- `JWT_SECRET`: Chave secreta para JWT (altere em produção)
- `WS_PATH`: Caminho do WebSocket (padrão: /socket.io)

## 📄 Formatação de Código

O projeto usa Prettier com as seguintes configurações:

- Aspas simples
- Sem ponto e vírgula
- Indentação de 2 espaços

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

MIT
