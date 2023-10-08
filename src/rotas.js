const express = require('express');

const rotas = express();

rotas.post('/usuario');

module.exports = rotas;