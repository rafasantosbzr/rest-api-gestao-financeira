const pool = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
const { nome, email, senha } = req.body;

if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
};

try {
    const validarEmail = `SELECT * FROM usuarios WHERE email = $1`;
    const emailValidado = await pool.query(validarEmail, [email]);

    if (emailValidado.rowCount > 0) {
        return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
    }

    const query = `INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) returning *`;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const valores = [nome, email, senhaCriptografada]

    const novoUsuario = await pool.query(query, valores);

    const { senha: _, ...usuario } = novoUsuario.rows[0];

    return res.status(201).json(usuario);
} catch (error) {
    console.log(error.message);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
}
};

const fazerLogin = async (req, res) => {

};

const detalharUsuario = async (req, res) => {

};

const editarUsuario = async (req, res) => {

};

module.exports = {
    cadastrarUsuario,
    fazerLogin,
    detalharUsuario,
    editarUsuario
};