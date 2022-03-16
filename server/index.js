const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const {API_KEY} = require('../config.js')

const app = express()
const port = 3000

function getRay() {

  return axios({
    method: 'get',
    url: `https://www.googleapis.com/blogger/v3/blogs/7511836?key=${API_KEY}`,
    headers: { }
  })
}

app.use(express.static(__dirname + '/../dist'));
app.use(express.json());

app.get('/backend/', (req, res) => {
  getRay()
  .then( (response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch( (error) => {
    console.log(error);
  });

  res.send('Hello World!')
})

app.listen(port, () => {
  console.log('Achewood Aggregator listening on port 3000')
})