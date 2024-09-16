const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const cors = require('cors');
const bcrypt = require('bcrypt');
const Usuario = require('./models/contact'); 

const uri = 'mongodb+srv://benjabena56:4735290920071007@react-back.teijv.mongodb.net/?retryWrites=true&w=majority&appName=React-Back';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));


app.post('/api/iniciarSesion', async (req, res) => {
  const { nombre, contraseña } = req.body;

  try {
    const usuarioEncontrado = await Usuario.findOne({ nombre: nombre });
    if (!usuarioEncontrado) {
      return res.status(400).send('Usuario no encontrado');
    }

    const esValida = await bcrypt.compare(contraseña, usuarioEncontrado.contraseña);
    if (esValida) {
      res.status(200).send('Sesión iniciada');
    } else {
      res.status(400).send('Contraseña incorrecta');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send('Error al iniciar sesión');
  }
});


app.post('/api/registrarse', async (req, res) => {
  const { nombre, contraseña } = req.body;

  try {
    const hash = await bcrypt.hash(contraseña, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      contraseña: hash 
    });

    await nuevoUsuario.save();
    res.status(201).send('Usuario registrado exitosamente');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error al registrar usuario');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
