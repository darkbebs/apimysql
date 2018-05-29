const express = require('express');
const config = require('../bin/config.json');
const app = express();
const mysql = require('./mysql2');
const router = express.Router();
//Rotas
const index = require('./routes/index');

app.use('/', index);

module.exports = app;
