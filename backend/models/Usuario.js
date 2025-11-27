const pool = require('../config/database');

class Usuario {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT * FROM usuarios ORDER BY nome');
            return rows;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }

    static async create(usuario) {
        try {
            const { nome, email, telefone } = usuario;
            const [result] = await pool.execute(
                'INSERT INTO usuarios (nome, email, telefone) VALUES (?, ?, ?)',
                [nome, email, telefone]
            );
            return result.insertId;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }
}

module.exports = Usuario;
