//requiriendo paquetes
const Duplex = require('stream').Duplex
const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/auth');
const { uploadImage } = require('../database/drive');


//Configuramos multer

const Multer = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;   //Extensiones que queremos recibir
    const mimetype = fileTypes.test(file.mimetype); //Obteniendo el mimetype del archivo
    const extname = fileTypes.test(path.extname(file.originalname)); //Obteniendo la extension del archivo

    //Validando que hemos recivido una imagen
    if (mimetype && extname) return cb(null, true);

    cb('Solo puedes subir imagenes'); //mensaje de error en caso de no haber recibido una imagen
  }
}).single('imagen');

//Rutas
router.post('/image?:key',auth, Multer, async (req, res) => {
  try {

    function bufferToStream(buffer) {  
      let stream = new Duplex();
      stream.push(buffer);
      stream.push(null);
      return stream;
    };

    const ext = path.extname(req.file.originalname); //obteniendo extension
    const mimetype = req.file.mimetype; //Obteniend mimetype
    const readStream = bufferToStream(req.file.buffer); 

    //Conseguimos la url
    const url = await uploadImage({shared: true},mimetype,ext,readStream);

    //respesta
    res.json({
      response : url,
      error : ''
    });

  } catch (error) {
    res.json({
      response: '',
      error: error.message
    });
  }
});

module.exports = router;