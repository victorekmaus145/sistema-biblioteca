# 📚 Sistema Biblioteca - CRUD Completo

Sistema de gerenciamento de biblioteca com operações CRUD, banco de dados MySQL e triggers.

## 🛠️ Tecnologias
- **Backend:** Node.js, Express
- **Banco de Dados:** MySQL
- **Frontend:** HTML, CSS, JavaScript
- **Versionamento:** Git, GitHub

## ⚡ Funcionalidades
- ✅ Cadastro e gerenciamento de livros
- ✅ Controle de usuários
- ✅ Sistema de empréstimos com validações
- ✅ 3 Triggers MySQL para integridade dos dados
- ✅ API REST completa

## 🚀 Como executar
1. Clone o repositório
2. Configure o MySQL com o script `database/biblioteca.sql`
3. Execute `npm install` na pasta backend
4. Execute `npm start`
5. Acesse `http://localhost:3000`

## 📊 Estrutura do Banco
- Tabelas: livros, usuarios, emprestimos
- Triggers: verificação de disponibilidade, atualização automática de status
