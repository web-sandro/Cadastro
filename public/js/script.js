const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/photo_upload_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    input.type === "password"
      ? (input.type = "text")
      : (input.type = "password");
    input.type === "password"
      ? (input.nextElementSibling.textContent = "👁️")
      : (input.nextElementSibling.textContent = "🙈");
  }

  function toggleIconVisibility() {
    var mensagem = document.getElementById("mensagem");
    var icon = document.getElementById("icon-upload");
    if (mensagem.value.trim() !== "") {
      icon.classList.add("hidden");
    } else {
      icon.classList.remove("hidden");
    }
  }
