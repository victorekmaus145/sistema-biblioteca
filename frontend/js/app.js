// URL da API - ajuste se necessário
const API_URL = 'http://localhost:3000/api';

// Variáveis globais
let livros = [];
let usuarios = [];
let emprestimos = [];

// ==================== FUNÇÕES DE NAVEGAÇÃO ====================

function mostrarSecao(secaoId) {
    // Esconder todas as seções
    document.querySelectorAll('.secao').forEach(secao => {
        secao.classList.remove('ativa');
    });
    
    // Mostrar seção selecionada
    document.getElementById(secaoId).classList.add('ativa');
    
    // Carregar dados específicos da seção
    if (secaoId === 'livros') {
        carregarLivros();
    } else if (secaoId === 'emprestimos') {
        carregarDadosEmprestimos();
    }
}

// ==================== FUNÇÕES DE LIVROS ====================

// Carregar TODOS os livros
async function carregarLivros() {
    try {
        mostrarCarregando('lista-livros');
        
        const response = await fetch(`${API_URL}/livros`);
        livros = await response.json();
        
        exibirLivros(livros);
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        exibirErro('lista-livros', 'Erro ao carregar livros');
    }
}

// Carregar livros DISPONÍVEIS
async function carregarLivrosDisponiveis() {
    try {
        mostrarCarregando('lista-livros');
        
        const response = await fetch(`${API_URL}/livros/disponiveis`);
        const livrosDisponiveis = await response.json();
        
        exibirLivros(livrosDisponiveis);
    } catch (error) {
        console.error('Erro ao carregar livros disponíveis:', error);
        exibirErro('lista-livros', 'Erro ao carregar livros disponíveis');
    }
}

// Exibir livros na tela
function exibirLivros(listaLivros) {
    const container = document.getElementById('lista-livros');
    
    if (listaLivros.length === 0) {
        container.innerHTML = '<div class="carregando">Nenhum livro encontrado</div>';
        return;
    }
    
    container.innerHTML = listaLivros.map(livro => `
        <div class="item-livro">
            <div class="info-livro">
                <h3>${livro.titulo}</h3>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Ano:</strong> ${livro.ano_publicacao || 'Não informado'}</p>
                <p><strong>ISBN:</strong> ${livro.isbn || 'Não informado'}</p>
            </div>
            <div class="status ${livro.disponivel ? 'disponivel' : 'indisponivel'}">
                ${livro.disponivel ? '✅ Disponível' : '❌ Emprestado'}
            </div>
        </div>
    `).join('');
}

// Cadastrar novo livro
document.getElementById('form-livro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const livro = {
        titulo: document.getElementById('titulo').value,
        autor: document.getElementById('autor').value,
        ano_publicacao: document.getElementById('ano').value || null,
        isbn: document.getElementById('isbn').value || null
    };
    
    try {
        const response = await fetch(`${API_URL}/livros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(livro)
        });
        
        if (response.ok) {
            exibirMensagem('Livro cadastrado com sucesso!', 'sucesso');
            document.getElementById('form-livro').reset();
            carregarLivros(); // Atualiza a lista
        } else {
            const erro = await response.json();
            exibirMensagem(`Erro: ${erro.error}`, 'erro');
        }
    } catch (error) {
        console.error('Erro ao cadastrar livro:', error);
        exibirMensagem('Erro ao cadastrar livro', 'erro');
    }
});

// ==================== FUNÇÕES DE EMPRÉSTIMOS ====================

// Carregar dados para empréstimos
async function carregarDadosEmprestimos() {
    try {
        // Carregar usuários
        const responseUsuarios = await fetch(`${API_URL}/usuarios`);
        usuarios = await responseUsuarios.json();
        
        // Carregar livros disponíveis
        const responseLivros = await fetch(`${API_URL}/livros/disponiveis`);
        const livrosDisponiveis = await responseLivros.json();
        
        // Preencher selects
        preencherSelectUsuarios();
        preencherSelectLivros(livrosDisponiveis);
        
        // Carregar empréstimos ativos
        await carregarEmprestimosAtivos();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Preencher select de usuários
function preencherSelectUsuarios() {
    const select = document.getElementById('select-usuario');
    select.innerHTML = '<option value="">Selecione um usuário</option>';
    
    usuarios.forEach(usuario => {
        select.innerHTML += `<option value="${usuario.id}">${usuario.nome}</option>`;
    });
}

// Preencher select de livros
function preencherSelectLivros(livrosDisponiveis) {
    const select = document.getElementById('select-livro');
    select.innerHTML = '<option value="">Selecione um livro</option>';
    
    livrosDisponiveis.forEach(livro => {
        select.innerHTML += `<option value="${livro.id}">${livro.titulo} - ${livro.autor}</option>`;
    });
}

// Registrar novo empréstimo
document.getElementById('form-emprestimo').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emprestimo = {
        usuario_id: document.getElementById('select-usuario').value,
        livro_id: document.getElementById('select-livro').value
    };
    
    try {
        const response = await fetch(`${API_URL}/emprestimos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emprestimo)
        });
        
        if (response.ok) {
            exibirMensagem('Empréstimo registrado com sucesso!', 'sucesso');
            document.getElementById('form-emprestimo').reset();
            await carregarDadosEmprestimos(); // Recarrega tudo
        } else {
            const erro = await response.json();
            exibirMensagem(`Erro: ${erro.error}`, 'erro');
        }
    } catch (error) {
        console.error('Erro ao registrar empréstimo:', error);
        exibirMensagem('Erro ao registrar empréstimo', 'erro');
    }
});

// Carregar empréstimos ativos (simulação)
async function carregarEmprestimosAtivos() {
    // Por enquanto, vamos simular - depois implementamos no backend
    const container = document.getElementById('lista-emprestimos');
    container.innerHTML = `
        <div class="carregando">
            ⚠️ Funcionalidade de empréstimos em desenvolvimento<br>
            As triggers no MySQL já estão funcionando!
        </div>
    `;
}
// Carregar empréstimos ativos (AGORA FUNCIONANDO!)
async function carregarEmprestimosAtivos() {
    try {
        const response = await fetch(`${API_URL}/emprestimos/ativos`);
        const emprestimos = await response.json();
        
        const container = document.getElementById('lista-emprestimos');
        
        if (emprestimos.length === 0) {
            container.innerHTML = '<div class="carregando">Nenhum empréstimo ativo</div>';
            return;
        }
        
        container.innerHTML = emprestimos.map(emp => `
            <div class="item-livro">
                <div class="info-livro">
                    <h3>${emp.titulo}</h3>
                    <p><strong>Usuário:</strong> ${emp.usuario_nome}</p>
                    <p><strong>Emprestado em:</strong> ${emp.data_emprestimo}</p>
                    <p><strong>Devolução prevista:</strong> ${emp.data_devolucao}</p>
                </div>
                <button onclick="devolverLivro(${emp.id})" class="devolver-btn">
                    📤 Devolver
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar empréstimos:', error);
        const container = document.getElementById('lista-emprestimos');
        container.innerHTML = '<div class="erro">Erro ao carregar empréstimos</div>';
    }
}

// Função para devolver livro
async function devolverLivro(emprestimoId) {
    if (confirm('Registrar devolução deste livro?')) {
        try {
            const response = await fetch(`${API_URL}/emprestimos/${emprestimoId}/devolver`, {
                method: 'PUT'
            });
            
            if (response.ok) {
                exibirMensagem('Devolução registrada com sucesso!', 'sucesso');
                await carregarDadosEmprestimos(); // Recarrega tudo
            } else {
                const erro = await response.json();
                exibirMensagem(`Erro: ${erro.error}`, 'erro');
            }
        } catch (error) {
            console.error('Erro ao registrar devolução:', error);
            exibirMensagem('Erro ao registrar devolução', 'erro');
        }
    }
}
// ==================== FUNÇÕES AUXILIARES ====================

function mostrarCarregando(containerId) {
    document.getElementById(containerId).innerHTML = '<div class="carregando">Carregando...</div>';
}

function exibirErro(containerId, mensagem) {
    document.getElementById(containerId).innerHTML = `<div class="erro">${mensagem}</div>`;
}

function exibirMensagem(mensagem, tipo) {
    const divMensagem = document.getElementById('mensagem');
    divMensagem.textContent = mensagem;
    divMensagem.className = `mensagem ${tipo}`;
    
    // Some após 3 segundos
    setTimeout(() => {
        divMensagem.textContent = '';
        divMensagem.className = 'mensagem';
    }, 3000);
}

// ==================== INICIALIZAÇÃO ====================

// Quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Frontend da Biblioteca carregado!');
    carregarLivros(); // Carrega livros automaticamente
});

// Teste de conexão com a API
async function testarConexao() {
    try {
        const response = await fetch(`${API_URL}/teste`);
        const data = await response.json();
        console.log('✅ Conexão com API:', data.message);
    } catch (error) {
        console.error('❌ Erro na conexão com API:', error);
        alert('⚠️ API não está respondendo! Execute: npm start no backend');
    }
}

// Testar conexão ao carregar
testarConexao();
