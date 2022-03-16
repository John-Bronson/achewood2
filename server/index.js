const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const { API_KEY } = require('../config.js')

const app = express()
const port = 3000


app.use(express.static(__dirname + '/../dist'));
app.use(express.json());

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

function getPosts(blogID) {
  return axios({
    method: 'get',
    url: `https://www.googleapis.com/blogger/v3/blogs/${blogID}/posts?key=${API_KEY}&maxResults=200`,
    headers: {}
  })
}

app.get('/blogs/', (req, res) => {
  let matchingBlogPosts = []
  let blogIDs = ['7511836', '7511899', '7511767', '7511919', '7512085', '7512001', '7512130', '7512155', '7511236', '7605624', '7660772', '25349750']

    getPosts('7511836').then((response) => {
      for (let i = 0; i < response.data.items.length; i++) {
        let requestedDate = new Date(req.headers.referencedate)
        let currentBlogDate = new Date(response.data.items[i].updated)

        if (datesAreOnSameDay(requestedDate, currentBlogDate)) {
          console.log('🗄', requestedDate, ' and ', currentBlogDate, ' are a match!')
          matchingBlogPosts.push(response.data.items[i])
        }
      }
      res.status(200).send(matchingBlogPosts)
    }).catch((error) => {
      console.log(error);
    });
})

app.get('/roastbeef/', (req, res) => {
  getPosts('7511899').then((response) => {
    matchingBlogPosts = []
    for (let i = 0; i < response.data.items.length; i++) {
      let requestedDate = new Date(req.headers.referencedate)
      let currentBlogDate = new Date(response.data.items[i].updated)

      if (datesAreOnSameDay(requestedDate, currentBlogDate)) {
        console.log('🗄', requestedDate, ' and ', currentBlogDate, ' are a match!')
        matchingBlogPosts.push(response.data.items[i])
      }
    }
    res.status(200).send(matchingBlogPosts)
  }).catch((error) => {
    console.log(error);
  });
})

app.listen(port, () => {
  console.log('Achewood Aggregator listening on port 3000')
})