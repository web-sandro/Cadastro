const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefas');

router.get('/', tarefaController.listarTarefas);

router.get('/cadastrar', tarefaController.exibirFormularioCadastro);

router.post('/cadastrar', tarefaController.cadastrarTarefa);

router.get('/exibir/:id', tarefaController.exibirDetalhesTarefa);

router.get('/deletar/:id', tarefaController.exibirFormularioDelecao);

router.post('/deletar/:id', tarefaController.deletarTarefa);

module.exports = router;