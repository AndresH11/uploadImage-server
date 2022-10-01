//requerimos mongoose
const mongoose = require('mongoose');

//URI
const URI = (process.env.MONGODB_URI);

//conectando a la base de datos
const connect = async()=>{
  try {
    mongoose.connect(URI);
    console.log('Se ha conectado a la db con exito :)');
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;