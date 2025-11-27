const express = require('express');
const router = express.Router();
const Emprestimo = require('../models/Emprestimo');

// Listar TODOS os empréstimos
router.get('/', async (req, res) => {
    try {
        console.log('📋 Buscando todos os empréstimos...');
        const emprestimos = await Emprestimo.getAll();
        res.json(emprestimos);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar empréstimos',
            detalhes: error.message 
        });
    }
});

// Listar empréstimos ATIVOS
router.get('/ativos', async (req, res) => {
    try {
        console.log('🔍 Buscando empréstimos ativos...');
        const emprestimos = await Emprestimo.getAtivos();
        res.json(emprestimos);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar empréstimos ativos',
            detalhes: error.message 
        });
    }
});

// Registrar NOVO empréstimo
router.post('/', async (req, res) => {
    try {
        console.log('📥 Registrando novo empréstimo...', req.body);
        
        if (!req.body.usuario_id || !req.body.livro_id) {
            return res.status(400).json({ 
                error: 'Usuário e livro são obrigatórios' 
            });
        }

        const novoId = await Emprestimo.create(req.body);
        
        res.status(201).json({ 
            message: 'Empréstimo registrado com sucesso!',
            id: novoId,
            emprestimo: req.body
        });
        
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao registrar empréstimo',
            detalhes: error.message 
        });
    }
});

// Registrar DEVOLUÇÃO
router.put('/:id/devolver', async (req, res) => {
    try {
        console.log('📤 Registrando devolução...', req.params.id);
        
        await Emprestimo.devolver(req.params.id);
        
        res.json({ 
            message: 'Devolução registrada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao registrar devolução',
            detalhes: error.message 
        });
    }
});

module.exports = router;
