//requerimos Schema de mongoose
const { Schema, default: mongoose } =require('mongoose');

const imageSchema = new Schema({
  name: String,
  mimetype: String,
  url: String,
  size : Number,
  creationDate : Date,
});

//modelo
const image = mongoose.model('image', imageSchema);

module.exports = image;