const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');
const pool = require('../conexao');

const validarToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, senhaJwt);
        const { rows, rowsCount } = await pool.query('select * from usuarios where id = $1', [id]);

        if (rowsCount < 1) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
        }

    const { senha, ...usuario } = rows[0]
    req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

module.exports = validarToken;