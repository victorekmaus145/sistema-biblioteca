const pool = require('../config/database');

class Livro {
    static async getAll() {
        try {
            const [rows] = await pool.execute('SELECT * FROM livros ORDER BY titulo');
            return rows;
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            throw error;
        }
    }

    static async getById(id) {
        try {
            const [rows] = await pool.execute('SELECT * FROM livros WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar livro:', error);
            throw error;
        }
    }

    static async create(livro) {
        try {
            const { titulo, autor, ano_publicacao, isbn } = livro;
            const [result] = await pool.execute(
                'INSERT INTO livros (titulo, autor, ano_publicacao, isbn) VALUES (?, ?, ?, ?)',
                [titulo, autor, ano_publicacao, isbn]
            );
            return result.insertId;
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            throw error;
        }
    }

    static async getDisponiveis() {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM livros WHERE disponivel = TRUE ORDER BY titulo'
            );
            return rows;
        } catch (error) {
            console.error('Erro ao buscar livros disponíveis:', error);
            throw error;
        }
    }
}

module.exports = Livro;