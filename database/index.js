let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/achewood');

let achewoodSchema = mongoose.Schema({
  date: Date,
  contentType: String,
  title: String,
  url: String
})

let Content = mongoose.model('Content', achewoodSchema)

let getContent = (date) => { //get all content matching the date passed in
  console.log('call to getContent successful')
  return Content.find()
}

module.exports.getContent = getContent