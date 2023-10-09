const express = require('express');
const rotas = express();

const { cadastrarUsuario, fazerLogin, detalharUsuario, editarUsuario } = require('./controladores/usuarios');
const { listarCategorias } = require('./controladores/categorias');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, editarTransacao, removerTransacao, obterExtrato } = require('./controladores/transacoes');
const validarToken = require('./intermediarios/autenticador');

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', fazerLogin);

rotas.use(validarToken);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', editarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/extrato', obterExtrato);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', editarTransacao);
rotas.delete('/transacao/:id', removerTransacao);

module.exports = rotas;

