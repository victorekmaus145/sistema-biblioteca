const express = require('express');
const router = express.Router();
const Livro = require('../models/Livro');

// ROTA 1: Listar TODOS os livros
router.get('/', async (req, res) => {
    try {
        console.log('📖 Buscando todos os livros...');
        const livros = await Livro.getAll();
        res.json(livros);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar livros',
            detalhes: error.message 
        });
    }
});

// ROTA 2: Listar livros DISPONÍVEIS
router.get('/disponiveis', async (req, res) => {
    try {
        console.log('🔍 Buscando livros disponíveis...');
        const livros = await Livro.getDisponiveis();
        res.json(livros);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar livros disponíveis',
            detalhes: error.message 
        });
    }
});

// ROTA 3: Cadastrar NOVO livro
router.post('/', async (req, res) => {
    try {
        console.log('➕ Cadastrando novo livro...', req.body);
        
        if (!req.body.titulo || !req.body.autor) {
            return res.status(400).json({ 
                error: 'Título e autor são obrigatórios' 
            });
        }

        const novoId = await Livro.create(req.body);
        
        res.status(201).json({ 
            message: 'Livro cadastrado com sucesso!',
            id: novoId,
            livro: req.body
        });
        
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao cadastrar livro',
            detalhes: error.message 
        });
    }
});

module.exports = router;