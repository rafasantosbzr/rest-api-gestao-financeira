const pool = require('../conexao');

const listarTransacoes = async (req, res) => {
    const { id: tokenId } = req.usuario;
    const { filtro } = req.query;

    try {
        let resultadoFiltragem = [];

        if (filtro && filtro.length > 1) {
            for (let i = 0; i < filtro.length; i++) {
                const filtrarTransacoes = `
                    SELECT t.*, c.descricao AS categoria_nome
                    FROM transacoes t
                    LEFT JOIN categorias c ON t.categoria_id = c.id
                    WHERE t.usuario_id = $1 AND c.descricao = $2
                `;
                const { rows } = await pool.query(filtrarTransacoes, [tokenId, filtro[i]]);
                resultadoFiltragem.push(...rows);
            }
        } else if (filtro && filtro.length === 1) {
            const filtrarTransacoes = `
                SELECT t.*, c.descricao AS categoria_nome
                FROM transacoes t
                LEFT JOIN categorias c ON t.categoria_id = c.id
                WHERE t.usuario_id = $1 AND c.descricao = $2
            `;
            const { rows } = await pool.query(filtrarTransacoes, [tokenId, filtro[0]]);
            resultadoFiltragem.push(...rows);
        } else if (!filtro) {
            const filtrarTransacoes = `
                SELECT t.*, c.descricao AS categoria_nome
                FROM transacoes t
                LEFT JOIN categorias c ON t.categoria_id = c.id
                WHERE t.usuario_id = $1
            `;
            const { rows } = await pool.query(filtrarTransacoes, [tokenId]);
            resultadoFiltragem.push(rows);
        } 

        return res.status(200).json(resultadoFiltragem);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

const detalharTransacao = async (req, res) => {
    const { id: tokenId } = req.usuario;
    const { id } = req.params;

    try {
        const validarTransacao = `SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2`;
        const { rows: transacao, rowCount } = await pool.query(validarTransacao, [id, tokenId]);

        if (rowCount < 1) {
             return res.status(400).json({ mensagem: 'Transação não encontrada.' });
        }

    return res.status(200).json(transacao[0]);
} catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
}
};

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const { id: tokenId } = req.usuario;

    if (!descricao || !valor || !data|| !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    try {
        const validarCategoria = `SELECT * FROM categorias WHERE id = $1`;
        const { rows, rowCount } = await pool.query(validarCategoria, [categoria_id]);

        if (rowCount < 1) {
            return res.status(400).json({ mensagem: 'Categoria inválida.' });
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: 'Tipo inválido.' });
        }

        const cadastrarTransacao = `INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) VALUES ($1, $2, $3, $4, $5, $6) returning *`;
        const valores = [descricao, valor, data, categoria_id, tokenId, tipo];
        const novaTransacao = await pool.query(cadastrarTransacao, valores);

        return res.status(201).json(novaTransacao.rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

const editarTransacao = async (req, res) => {
    const { id: tokenId } = req.usuario;
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    try {
        const validarTransacao = `SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2`;
        const transacaoValidada = await pool.query(validarTransacao, [id, tokenId]);
        
        if (transacaoValidada.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Transação não encontrada.' });
        }

        const validarCategoria = `SELECT * FROM categorias WHERE id = $1`;
        const categoriaValidada = await pool.query(validarCategoria, [categoria_id]);

        if (categoriaValidada.rowCount < 1) {
            return res.status(400).json({ mensagem: 'Categoria inválida.' });
        }

        if (tipo !== 'entrada' && tipo !== 'saida') {
            return res.status(400).json({ mensagem: 'Tipo inválido.' });
        }

        const atualizarTransacao = `UPDATE transacoes SET descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 WHERE id = $6 RETURNING *`;
        const valores = [descricao, valor, data, categoria_id, tipo, id];
        const transacaoAtualizada = await pool.query(atualizarTransacao, valores);

        return res.status(204).send();
    } catch (error) {
       return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

const removerTransacao = async (req, res) => {
    const { id: tokenId } = req.usuario;
    const { id } = req.params;

    try {
        const validarTransacao = `SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2`;
        const { rows, rowCount } = await pool.query(validarTransacao, [id, tokenId]);
        
        if (rowCount < 1) {
            return res.status(400).json({ mensagem: 'Transação não encontrada.' });
        }

        const excluirTransacao = `DELETE FROM transacoes WHERE id = $1 AND usuario_id = $2`;
        const transacaoExcluida = await pool.query(excluirTransacao, [id, tokenId]);

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

const obterExtrato = async (req, res) => {
    const { id: tokenId } = req.usuario;

    try {
        let saldo = 0;

        const queryEntradas = `SELECT * FROM transacoes WHERE usuario_id = $1 AND tipo = 'entrada'`;
        const listagemEntradas = await pool.query(queryEntradas, [tokenId]);

        const querySaidas = `SELECT * FROM transacoes WHERE usuario_id = $1 AND tipo = 'saida'`;
        const listagemSaidas = await pool.query(querySaidas, [tokenId]);

        const entrada = listagemEntradas.rows.reduce((acumulador, elementoAtual) => acumulador + elementoAtual.valor, saldo);
        const saida = listagemSaidas.rows.reduce((acumulador, elementoAtual) => acumulador + elementoAtual.valor, saldo);

        return res.status(200).json({entrada, saida});
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
};

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    editarTransacao,
    removerTransacao,
    obterExtrato
};