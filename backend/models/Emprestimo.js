const pool = require('../config/database');

class Emprestimo {
    static async getAll() {
        try {
            const [rows] = await pool.execute(`
                SELECT e.*, l.titulo, u.nome as usuario_nome 
                FROM emprestimos e 
                JOIN livros l ON e.livro_id = l.id 
                JOIN usuarios u ON e.usuario_id = u.id 
                ORDER BY e.data_emprestimo DESC
            `);
            return rows;
        } catch (error) {
            console.error('Erro ao buscar empréstimos:', error);
            throw error;
        }
    }

    static async create(emprestimo) {
        try {
            const { usuario_id, livro_id } = emprestimo;
            
            const [result] = await pool.execute(
                `INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_devolucao) 
                 VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY))`,
                [usuario_id, livro_id]
            );
            return result.insertId;
        } catch (error) {
            console.error('Erro ao criar empréstimo:', error);
            throw error;
        }
    }

    static async devolver(id) {
        try {
            await pool.execute(
                'UPDATE emprestimos SET data_devolvida = CURDATE() WHERE id = ?',
                [id]
            );
        } catch (error) {
            console.error('Erro ao registrar devolução:', error);
            throw error;
        }
    }

    static async getAtivos() {
        try {
            const [rows] = await pool.execute(`
                SELECT e.*, l.titulo, u.nome as usuario_nome 
                FROM emprestimos e 
                JOIN livros l ON e.livro_id = l.id 
                JOIN usuarios u ON e.usuario_id = u.id 
                WHERE e.data_devolvida IS NULL
                ORDER BY e.data_emprestimo DESC
            `);
            return rows;
        } catch (error) {
            console.error('Erro ao buscar empréstimos ativos:', error);
            throw error;
        }
    }
}

module.exports = Emprestimo;
