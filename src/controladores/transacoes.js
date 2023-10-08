const pool = require('../conexao');

const listarTransacoes = async (req, res) => {
    const { id: tokenId } = req.usuario;

    try {
        const obterTransacoes = `SELECT * FROM transacoes WHERE usuario_id = $1`;
        const { rows: transacoes } = await pool.query(obterTransacoes, [tokenId]);
    
        return res.status(200).json(transacoes);        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const detalharTransacao = async (req, res) => {

};

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { id: tokenId } = req.usuario;

    if (!descricao || !valor || !data|| !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
    }

    try {
        const validarCategoria = `SELECT * FROM categorias WHERE id = $1`;
        const { rows, rowCount } = await pool.query(validarCategoria, [categoria_id]);

        if (rowCount < 1) {
            return res.status(400).json({ mensagem: 'Categoria inválida!' });
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: 'Tipo inválido!' });
        }
        const cadastrarTransacao = `INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) returning *`;
        const valores = [descricao, valor, data, categoria_id, tokenId, tipo];
        const novaTransacao = await pool.query(cadastrarTransacao, valores);

        return res.status(201).json(novaTransacao.rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
};

const editarTransacao = async (req, res) => {
 
};

const removerTransacao = async (req, res) => {

};

const obterExtrato = async (req, res) => {

};


module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    editarTransacao,
    removerTransacao,
    obterExtrato
};