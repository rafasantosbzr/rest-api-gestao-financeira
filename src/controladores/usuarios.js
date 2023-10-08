const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');

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

    const cadastrarNovoUsuario = `INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) returning *`;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const valores = [nome, email, senhaCriptografada]

    const { rows, rowCount } = await pool.query(cadastrarNovoUsuario, valores);

    const { senha: _, ...usuario } = rows[0];

    return res.status(201).json(usuario);
} catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
}
};

const fazerLogin = async (req, res) => {
const { email, senha } = req.body;

if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
}

try {
    const validarUsuario = `SELECT * FROM usuarios WHERE email = $1`;
    const usuarioValidado = await pool.query(validarUsuario, [email]);

    if (usuarioValidado.rowCount < 1) {
        return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    };

    const senhaValidada = await bcrypt.compare(senha, usuarioValidado.rows[0].senha);

    if (!senhaValidada) {
        return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
    };

    const token = jwt.sign({ id: usuarioValidado.rows[0].id }, senhaJwt, {
        expiresIn: 28800
    });

    const { senha: _, ...usuario } = usuarioValidado.rows[0];

    return res.status(200).json({usuario, token});
} catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
}
};

const detalharUsuario = async (req, res) => {
const {id: tokenId} = req.usuario;

try {
    const validarTokenId = `SELECT * FROM usuarios WHERE id = $1`;
    const { rows, rowCount } = await pool.query(validarTokenId, [tokenId]);

    if (rowCount < 1) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação deve ser enviado.' });
    }

    const { senha: _, ...usuario } = rows[0]

    return res.status(200).json(usuario);
} catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
}
};

const editarUsuario = async (req, res) => {
const {nome, email, senha} = req.body;
const {id: tokenId} = req.usuario;

if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios!' });
}

try {
    const validarTokenId = `SELECT * FROM usuarios WHERE id = $1`;
    const { rows, rowCount } = await pool.query(validarTokenId, [tokenId]);
    
    if (rowCount < 1) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação deve ser enviado.' });
    }
    
    if (email === rows[0].email) {
        return res.status(400).json({ mensagem: 'O e-mail informado já existe.' });
    }

    const atualizarUsuario = `UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *`;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const valores = [nome, email, senhaCriptografada, tokenId];
    await pool.query(atualizarUsuario, valores);

    return res.status(204).send();
} catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
}
};

module.exports = {
    cadastrarUsuario,
    fazerLogin,
    detalharUsuario,
    editarUsuario
};