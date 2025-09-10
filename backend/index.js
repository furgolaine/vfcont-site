const express = require('express');
const { Pool } = require('pg');
const Redis = require('ioredis');
const { Queue, Worker } = require('bullmq');

const app = express();
const port = 3000;

app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER || 'user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'contabilidade_db',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// Configuração do Redis para BullMQ
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
};

// Fila para mensagens do WhatsApp
const whatsappQueue = new Queue('whatsappMessages', { connection: redisConfig });

// Simulação de API do WhatsApp
const sendWhatsappMessage = async (lead) => {
    console.log(`Simulando envio de mensagem WhatsApp para ${lead.telefone} (Lead ID: ${lead.id}):`);
    console.log(`Olá ${lead.nome}! Agradecemos por usar nossa calculadora de IR. Em breve um de nossos especialistas entrará em contato.`);
    // Aqui seria a integração real com a WhatsApp Cloud API
    return { success: true, message: 'Mensagem WhatsApp simulada enviada.' };
};

// Simulação de API do Facebook Conversions
const sendFacebookConversion = async (lead) => {
    console.log(`Simulando envio de conversão para Facebook Conversions API para ${lead.email} (Lead ID: ${lead.id})`);
    // Aqui seria a integração real com a Facebook Conversions API
    return { success: true, message: 'Conversão Facebook simulada enviada.' };
};

// Worker para processar a fila do WhatsApp
new Worker('whatsappMessages', async (job) => {
    const { lead } = job.data;
    await sendWhatsappMessage(lead);
}, { connection: redisConfig });

// Endpoint para captação de leads
app.post('/leads', async (req, res) => {
    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
        return res.status(400).json({ error: 'Nome, email e telefone são obrigatórios.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO leads (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *',
            [nome, email, telefone]
        );
        const newLead = result.rows[0];

        // Agendar mensagem WhatsApp após 10 minutos
        await whatsappQueue.add('sendWhatsapp', { lead: newLead }, { delay: 10 * 60 * 1000 }); // 10 minutos

        // Enviar conversão para Facebook
        await sendFacebookConversion(newLead);

        res.status(201).json({ message: 'Lead cadastrado com sucesso!', lead: newLead });
    } catch (err) {
        console.error('Erro ao cadastrar lead:', err);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// Endpoint para a calculadora de IR (exemplo, a lógica pode ser mais complexa)
app.post('/calculate-ir', (req, res) => {
    const { rendaBruta, deducoes, dependentes, previdencia } = req.body;

    // Lógica da calculadora de IR (simplificada para o exemplo)
    const baseCalculo = Math.max(0, rendaBruta - deducoes - (dependentes * 2275.08) - previdencia);
    let impostoDevido = 0;

    if (baseCalculo > 0) {
        // Exemplo de faixas simplificadas
        if (baseCalculo <= 22847.76) {
            impostoDevido = 0;
        } else if (baseCalculo <= 33919.80) {
            impostoDevido = (baseCalculo - 22847.76) * 0.075;
        } else if (baseCalculo <= 45012.60) {
            impostoDevido = (33919.80 - 22847.76) * 0.075 + (baseCalculo - 33919.80) * 0.15;
        } else {
            impostoDevido = (33919.80 - 22847.76) * 0.075 + (45012.60 - 33919.80) * 0.15 + (baseCalculo - 45012.60) * 0.225;
        }
    }

    res.json({ impostoDevido: impostoDevido.toFixed(2), baseCalculo: baseCalculo.toFixed(2) });
});

// Lógica para agendamento de lembretes de IR (exemplo com BullMQ)
// Em um ambiente real, você usaria um cron job ou um agendador mais robusto
const irReminderQueue = new Queue('irReminders', { connection: redisConfig });

// Adicionar um job recorrente para o último dia de cada mês
// Nota: Em produção, você configuraria isso para rodar em um servidor dedicado
// e garantiria que o worker esteja sempre ativo.
// Para fins de demonstração, vamos apenas adicionar um job que simula isso.
const setupMonthlyReminder = async () => {
    // Remover jobs recorrentes existentes para evitar duplicação em testes
    await irReminderQueue.removeJobs('monthlyReminder');

    // Adicionar job recorrente para o último dia de cada mês às 9h da manhã
    // Cron: '0 9 L * *' -> Minuto 0, Hora 9, Último dia do mês, Qualquer mês, Qualquer dia da semana
    await irReminderQueue.add('monthlyReminder', { type: 'IR_REMINDER' }, {
        repeat: { cron: '0 9 L * *' },
        jobId: 'monthlyReminder'
    });
    console.log('Lembrete mensal de IR agendado para o último dia de cada mês às 09:00.');
};

// Worker para processar lembretes de IR
new Worker('irReminders', async (job) => {
    if (job.data.type === 'IR_REMINDER') {
        console.log('Disparando lembrete mensal de IR...');
        // Aqui você buscaria os usuários e enviaria as mensagens
        // Por exemplo, buscar todos os leads e enviar uma mensagem simulada
        const leads = await pool.query('SELECT nome, telefone FROM leads');
        for (const lead of leads.rows) {
            console.log(`Simulando envio de lembrete de IR para ${lead.nome} (${lead.telefone})`);
            // sendWhatsappMessage({ nome: lead.nome, telefone: lead.telefone }); // Reutilizar função de envio
        }
    }
}, { connection: redisConfig });

// Inicializar o agendamento de lembretes ao iniciar o servidor
setupMonthlyReminder().catch(err => console.error('Erro ao configurar lembrete mensal:', err));

app.listen(port, () => {
    console.log(`Backend rodando em https://vfcont-site-production.up.railway.app:${port}`);
    console.log('Certifique-se de que o PostgreSQL e o Redis estão rodando.');
});

// Função para criar a tabela de leads no PostgreSQL (se não existir)
const createLeadsTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                telefone VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Tabela de leads verificada/criada no PostgreSQL.');
    } catch (err) {
        console.error('Erro ao criar tabela de leads:', err);
    }
};

// Chamar a função para criar a tabela ao iniciar
createLeadsTable();


