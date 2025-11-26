-- 1. Criar banco de dados
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- 2. Tabela de livros
CREATE TABLE livros (
id INT PRIMARY KEY AUTO_INCREMENT,
titulo VARCHAR(200) NOT NULL,
autor VARCHAR(100) NOT NULL,
ano_publicacao INT,
isbn VARCHAR(20),
disponivel BOOLEAN DEFAULT TRUE
);

-- 3. Tabela de usuários
CREATE TABLE usuarios (
id INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE,
telefone VARCHAR(20)
);

-- 4. Tabela de empréstimos
CREATE TABLE emprestimos (
id INT PRIMARY KEY AUTO_INCREMENT,
usuario_id INT,
livro_id INT,
data_emprestimo DATE,
data_devolucao DATE,
data_devolvida DATE NULL,
FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
FOREIGN KEY (livro_id) REFERENCES livros(id)
);

-- 5. TRIGGER 1: Impedir empréstimo de livro indisponível
DELIMITER $$
CREATE TRIGGER trg_verificar_disponibilidade
BEFORE INSERT ON emprestimos
FOR EACH ROW
BEGIN
DECLARE livro_disponivel BOOLEAN;

SELECT disponivel INTO livro_disponivel
FROM livros
WHERE id = NEW.livro_id;

IF NOT livro_disponivel THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Livro não está disponível para empréstimo';
END IF;

END$$
DELIMITER ;

-- Ana pega "Dom Casmurro" (funciona)
INSERT INTO emprestimos (usuario_id, livro_id) VALUES (1, 1);

-- Carlos tenta pegar o MESMO livro (BLOQUEADO!)
INSERT INTO emprestimos (usuario_id, livro_id) VALUES (2, 1);
-- ↑↑↑ ERRO: "Livro não está disponível para empréstimo"


-- 6. TRIGGER 2: Atualizar disponibilidade ao emprestar
DELIMITER $$
CREATE TRIGGER trg_atualizar_disponibilidade_emprestimo
AFTER INSERT ON emprestimos
FOR EACH ROW
BEGIN
UPDATE livros SET disponivel = FALSE WHERE id = NEW.livro_id;
END$$
DELIMITER ;

-- Antes: "Dom Casmurro" está disponível
SELECT titulo, disponivel FROM livros WHERE id = 1;
-- Resultado: Dom Casmurro | SIM

-- Ana pega o livro
INSERT INTO emprestimos (usuario_id, livro_id) VALUES (1, 1);

-- Depois: "Dom Casmurro" está INDISPONÍVEL
SELECT titulo, disponivel FROM livros WHERE id = 1;
-- Resultado: Dom Casmurro | NÃO

-- 7. TRIGGER 3: Atualizar disponibilidade ao devolver
DELIMITER $$
CREATE TRIGGER trg_atualizar_disponibilidade_devolucao
AFTER UPDATE ON emprestimos
FOR EACH ROW
BEGIN
IF NEW.data_devolvida IS NOT NULL AND OLD.data_devolvida IS NULL THEN
UPDATE livros SET disponivel = TRUE WHERE id = NEW.livro_id;
END IF;
END$$
DELIMITER ;

-- Ana devolve "Dom Casmurro"
UPDATE emprestimos SET data_devolvida = CURDATE() WHERE id = 1;

-- O livro volta a ficar DISPONÍVEL
SELECT titulo, disponivel FROM livros WHERE id = 1;
-- Resultado: Dom Casmurro | SIM


-- 8. Dados de exemplo para testar
INSERT INTO livros (titulo, autor, ano_publicacao, isbn) VALUES
('Dom Casmurro', 'Machado de Assis', 1899, '978-85-7232-144-9'),
('O Cortiço', 'Aluísio Azevedo', 1890, '978-85-7232-145-6'),
('Iracema', 'José de Alencar', 1865, '978-85-7232-146-3'),
('Memórias Póstumas de Brás Cubas', 'Machado de Assis', 1881, '978-85-7232-147-0');

INSERT INTO usuarios (nome, email, telefone) VALUES
('Ana Silva', 'ana.silva@email.com', '(11) 9999-1111'),
('Carlos Santos', 'carlos.santos@email.com', '(11) 9999-2222'),
('Marina Oliveira', 'marina.oliveira@email.com', '(11) 9999-3333');

-- 9. Verificar se deu certo
SELECT '=== LIVROS CADASTRADOS ===' as '';
SELECT * FROM livros;

SELECT '=== USUÁRIOS CADASTRADOS ===' as '';
SELECT * FROM usuarios;

SHOW TRIGGERS;

