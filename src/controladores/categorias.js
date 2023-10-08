const pool = require('../conexao');

const listarCategorias = async (req, res) => {
try {
    const buscarCategorias = `SELECT * FROM categorias`;
    const { rows } = await pool.query(buscarCategorias);

    return res.status(200).json(rows);
} catch (error) {
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
}
};

module.exports = {
    listarCategorias
};