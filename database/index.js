let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/achewood');

let achewoodSchema = mongoose.Schema({
  date: Date,
  contentType: String,
  title: String,
  url: String
})

let 