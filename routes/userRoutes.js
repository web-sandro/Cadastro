const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');

router.get('/', userController.index);

router.get('/exibir/:id', userController.show);

router.get('/cadastrar/', userController.createForm);
router.post('/cadastrar/', userController.create);

router.get('/atualizar/:id', userController.editForm);
router.post('/atualizar/:id', userController.edit);

router.get('/deletar/:id', userController.deleteForm);
router.post('/deletar/:id', userController.delete);


module.exports = router;