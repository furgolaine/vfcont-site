# Backend VF Contabilidade

## Descrição
Backend Node.js para o site de contabilidade VF, incluindo API de leads, integração com PostgreSQL, Redis para filas, e simulação de APIs do WhatsApp e Facebook Conversions.

## Arquitetura

### Tecnologias Utilizadas
- **Node.js** com Express.js
- **PostgreSQL** para armazenamento de dados
- **Redis** para filas e cache
- **BullMQ** para processamento de filas
- **WhatsApp Cloud API** (simulado)
- **Facebook Conversions API** (simulado)

### Fluxo Principal
1. **Captação de Lead**: Frontend envia dados via POST /leads
2. **Armazenamento**: Dados salvos no PostgreSQL
3. **Conversão Facebook**: Conversão registrada imediatamente (simulado)
4. **Agendamento WhatsApp**: Mensagem agendada para 10 minutos após cadastro
5. **Lembretes IR**: Lembretes mensais agendados automaticamente

## Instalação e Configuração

### Pré-requisitos
- Node.js 16+ 
- PostgreSQL 13+
- Redis 6+
- Docker (opcional, para usar docker-compose)

### Instalação com Docker (Recomendado)

1. **Clone o projeto e navegue para o diretório backend**
```bash
cd backend
```

2. **Inicie os serviços com Docker Compose**
```bash
docker-compose up -d
```

3. **Instale as dependências**
```bash
npm install
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env conforme necessário
```

5. **Inicie o servidor**
```bash
npm start
```

### Instalação Manual

1. **Instale PostgreSQL e Redis**
2. **Configure as variáveis de ambiente no arquivo .env**
3. **Instale as dependências**
```bash
npm install
```
4. **Inicie o servidor**
```bash
npm start
```

## Endpoints da API

### POST /leads
Cadastra um novo lead e inicia o fluxo de engajamento.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(27) 99999-9999"
}
```

**Response:**
```json
{
  "message": "Lead cadastrado com sucesso!",
  "lead": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(27) 99999-9999",
    "created_at": "2024-01-01T10:00:00.000Z"
  }
}
```

### POST /calculate-ir
Calcula o Imposto de Renda baseado nos dados fornecidos.

**Body:**
```json
{
  "rendaBruta": 60000,
  "deducoes": 0,
  "dependentes": 0,
  "previdencia": 0
}
```

**Response:**
```json
{
  "impostoDevido": "6067.68",
  "baseCalculo": "60000.00"
}
```

## Estrutura do Banco de Dados

### Tabela: leads
```sql
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Filas e Workers

### Fila: whatsappMessages
- **Propósito**: Processar envio de mensagens WhatsApp
- **Delay**: 10 minutos após cadastro do lead
- **Worker**: Processa automaticamente as mensagens agendadas

### Fila: irReminders
- **Propósito**: Enviar lembretes mensais sobre declaração de IR
- **Agendamento**: Último dia de cada mês às 09:00
- **Worker**: Processa e envia lembretes para todos os leads

## Simulações de API

### WhatsApp Cloud API
A função `sendWhatsappMessage` simula o envio de mensagens via WhatsApp Cloud API. Para integração real:

1. Obtenha um token de acesso no Facebook Developers
2. Configure o webhook para receber respostas
3. Substitua a simulação pela chamada real da API

### Facebook Conversions API
A função `sendFacebookConversion` simula o registro de conversões. Para integração real:

1. Configure o Facebook Pixel no frontend
2. Obtenha o token de acesso para Conversions API
3. Substitua a simulação pela chamada real da API

## Monitoramento e Logs

O sistema registra logs detalhados para:
- Cadastro de leads
- Processamento de filas
- Simulações de envio
- Erros e exceções

## Segurança

- Validação de dados de entrada
- Sanitização de queries SQL
- Variáveis de ambiente para credenciais
- CORS configurado para frontend

## Escalabilidade

- Redis para cache e filas distribuídas
- Workers podem ser executados em múltiplas instâncias
- PostgreSQL com índices otimizados
- Arquitetura preparada para microserviços

## Desenvolvimento

### Scripts Disponíveis
- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia com nodemon para desenvolvimento
- `npm test`: Executa testes (a implementar)

### Estrutura de Arquivos
```
backend/
├── index.js              # Arquivo principal
├── package.json           # Dependências e scripts
├── docker-compose.yml     # Configuração Docker
├── .env.example          # Exemplo de variáveis de ambiente
└── README.md             # Esta documentação
```

## Próximos Passos

1. **Implementar testes unitários e de integração**
2. **Adicionar autenticação JWT para endpoints administrativos**
3. **Implementar dashboard para visualização de leads**
4. **Adicionar métricas e monitoramento com Prometheus**
5. **Configurar CI/CD para deploy automatizado**
6. **Implementar rate limiting para proteção contra spam**

## Suporte

Para dúvidas ou problemas, consulte os logs do servidor ou entre em contato com a equipe de desenvolvimento.

