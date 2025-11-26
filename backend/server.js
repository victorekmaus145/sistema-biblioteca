const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
    console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rota de TESTE
app.get('/api/teste', (req, res) => {
    res.json({ 
        message: '🚀 Backend da Biblioteca funcionando!',
        data: new Date().toISOString()
    });
});

// Rotas da API
app.use('/api/livros', require('./routes/livros'));

// Rota padrão
app.get('/', (req, res) => {
    res.json({
        message: 'Bem-vindo à API da Biblioteca!',
        endpoints: {
            teste: 'GET /api/teste',
            livros: 'GET /api/livros',
            livrosDisponiveis: 'GET /api/livros/disponiveis',
            cadastrarLivro: 'POST /api/livros'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('===================================');
    console.log('📚 SISTEMA BIBLIOTECA - BACKEND');
    console.log('===================================');
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log('===================================');
});