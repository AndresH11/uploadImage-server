const connect = require('./database/db');
const router = require('./routes/image');
//Requerimo express
const express = require('express');
//Instancimaos express
const app = express();

//Asignamo un puerto
const PORT = process.env.PORT || 3001; //VARIABLE DE ENTORNOOOO

//Connectando a la base de datos
connect();

//Middleware
app.use(express.json());
app.use('/upload', router);

//Rutas

//Levantamos el servidor
app.listen(PORT, () => {
  console.log(`El servidor está escuchando en el puerto ${PORT}`);
});