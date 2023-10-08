const express = require('express');
const { cadastrarUsuario, fazerLogin, detalharUsuario, editarUsuario } = require('./controladores/usuarios');
const { listarCategorias } = require('./controladores/categorias');
const { listarTransacoes, detalharTransacao, cadastrarTransacao, editarTransacao, removerTransacao, obterExtrato } = require('./controladores/transacoes');

const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', fazerLogin);
rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', editarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', editarTransacao);
rotas.delete('/transacao/:id', removerTransacao);
rotas.get('/transacao/extrato', obterExtrato);


module.exports = rotas;

