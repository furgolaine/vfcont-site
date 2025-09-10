## Tarefas do Projeto - Backend do Site de Contabilidade

### Fase 1: Configuração do Projeto Node.js e Instalação de Dependências
- [x] Criar o diretório para o backend e inicializar o projeto Node.js.
- [x] Instalar as dependências necessárias (express, pg, redis, bullmq).
- [x] Criar o arquivo principal do backend (`index.js`).
- [x] Criar o arquivo `docker-compose.yml` para PostgreSQL e Redis.

### Fase 2: Implementação da API de Leads e Integração com PostgreSQL
- [x] Definir o esquema do banco de dados para leads.
- [x] Implementar o endpoint `/leads` para receber e salvar dados no PostgreSQL.
- [x] Adicionar validação de dados para o endpoint de leads.

### Fase 3: Configuração do Redis e BullMQ para Mensageria
- [x] Configurar a conexão com o Redis para BullMQ.
- [x] Criar a fila `whatsappMessages` para agendamento de mensagens.
- [x] Implementar o worker para processar a fila de mensagens do WhatsApp.

### Fase 4: Desenvolvimento das Funções de Simulação para WhatsApp e Facebook APIs
- [x] Criar a função `sendWhatsappMessage` para simular o envio de mensagens via WhatsApp Cloud API.
- [x] Criar a função `sendFacebookConversion` para simular o envio de conversões para Facebook Conversions API.
- [x] Integrar as funções de simulação nos endpoints relevantes.

### Fase 5: Implementação da Lógica de Agendamento de Lembretes de IR
- [x] Criar a fila `irReminders` para agendamento de lembretes de IR.
- [x] Implementar a lógica para agendar lembretes mensais (último dia do mês).
- [x] Criar o worker para processar os lembretes de IR e simular o envio.

### Fase 6: Testes e Empacotamento do Backend
- [x] Testar o endpoint de leads (POST /leads).
- [x] Verificar o agendamento e processamento de mensagens WhatsApp simuladas.
- [x] Testar o endpoint da calculadora de IR (POST /calculate-ir).
- [x] Verificar o agendamento e processamento de lembretes de IR simulados.
- [x] Empacotar o backend em um arquivo .zip.

### Fase 7: Entrega do Backend em arquivo .zip
- [x] Entregar o arquivo .zip do backend ao usuário.

