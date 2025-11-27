const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Listar TODOS os usuários
router.get('/', async (req, res) => {
    try {
        console.log('👥 Buscando todos os usuários...');
        const usuarios = await Usuario.getAll();
        res.json(usuarios);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar usuários',
            detalhes: error.message 
        });
    }
});

// Cadastrar NOVO usuário
router.post('/', async (req, res) => {
    try {
        console.log('➕ Cadastrando novo usuário...', req.body);
        
        if (!req.body.nome) {
            return res.status(400).json({ 
                error: 'Nome é obrigatório' 
            });
        }

        const novoId = await Usuario.create(req.body);
        
        res.status(201).json({ 
            message: 'Usuário cadastrado com sucesso!',
            id: novoId,
            usuario: req.body
        });
        
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ 
            error: 'Erro ao cadastrar usuário',
            detalhes: error.message 
        });
    }
});

module.exports = router;
