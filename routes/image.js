//requiriendo paquetes
const url = require('url');
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const image = require('../models/imageModel');  //requiriendo el modelo de la imagen
const router = express.Router();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');


//Configuramos multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: (req, file, cb) => {
    //Obtenemos la extencion de la imagen
    const extend = file.mimetype.split('/')[1];

    cb(null, file.filename = `${uuidv4()}.${extend}`);
  },
});

//instanciamos la configuracion storage (multer)
const upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;   //Extensiones que queremos recibir
    const mimetype = fileTypes.test(file.mimetype); //Obteniendo el mimetype del archivo
    const extname = fileTypes.test(path.extname(file.originalname)); //Obteniendo la extension del archivo

    //Validando que hemos recivido una imagen
    if (mimetype && extname) return cb(null, true);

    cb('Solo puedes subir imagenes');
  }
}).single('imagen');

//Rutas
router.post('/image?:key', auth, upload, async (req, res) => {
  try {

    //creando url
    const { href } = url.parse(path.join(__dirname, `../images/${req.file.filename}`));

    //Creamos un objeto imagen con sus valores
    const photo = new image({
      name: req.file.filename,
      mimetype: req.file.mimetype,
      url: href,
      size: req.file.size,
      creationDate: new Date,
    });

    //Subiendo a la bse de datos
    await photo.save();

    //Traemos la imagen del la base de datos
    const imagen = await image.findOne({ name: req.file.filename });
    //Respuesta del servidor
    res.json({
      response: imagen,
      error: ''
    });

  } catch (error) {
    res.json({
      response: '',
      error: error.message
    });
  }
});

//Eliminar una imagen
router.delete('/delete?:id', async (req, res) => {
  try {
    S
    //Eliminando las fotos
    fs.unlink(path.join(__dirname, '../images', `${req.body.id}`), (err) => {

      //HAY QUE HACERLE UNA BUENA VALIDACION
      if (err) return console.log('esto es un error');

    });

    //Elimiando la imagen en ga base de datos
    await image.findOneAndDelete({ name: req.body.id });

    //Respuesta del servidor
    res.json({
      reponse: `${req.body.id} Eliminado correctamente`,
      error: ''
    });
  } catch (error) {
    res.json({
      response: '',
      error: error.message
    });
  }
});

module.exports = router;