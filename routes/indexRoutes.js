const express = require('express');
const router = express.Router();
const pool = require('../config/dbConfig');
const multer = require('multer');

const path = require('path');
const { v4: uuidv4 } = require('uuid');
  
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    const extension = path.extname(file.originalname).toLowerCase();
    const newFilename = uniqueFilename + extension;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });


router.get('/', function (req, res, next) {
  console.log(req.session)

  const { user } = req.session;
  res.render('index', { user });
});


module.exports = router;
