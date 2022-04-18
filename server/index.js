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

blogPostCache = []

app.get('/blogPostCache')

app.get('/strip/', (req, res) => {

  sampleComicData = {
    '2004-07-01T12:00:00.000Z': 'http://achewood.com/comic.php?date=07012004',
    'Thu Jul 01 2004 10:00:00 GMT-0500 (Central Daylight Time)': 'http://achewood.com/comic.php?date=07012004',
    'Fri Jul 02 2004 10:00:00 GMT-0500 (Central Daylight Time)': 'http://achewood.com/comic.php?date=07022004',
    'Sat Jul 03 2004 10:00:00 GMT-0500 (Central Daylight Time)': '',
    'Tue Jul 06 2004 10:00:00 GMT-0500 (Central Daylight Time)': 'https://achewood.com/comic.php?date=07062004',
    'Wed Jul 07 2004 10:00:00 GMT-0500 (Central Daylight Time)': 'https://achewood.com/comic.php?date=07072004'
  }

  console.log('referencedate is ', req.headers.referencedate)
  console.log(sampleComicData[req.headers.referencedate])
  res.status(200).send(sampleComicData[req.headers.referencedate])
})

app.get('/blogs/', (req, res) => {
  let allRequests = []
  let matchingBlogPosts = []

  let blogIDs = ['7511836', '7511899', '7511767', '7511919', '7512085', '7512001', '7512130', '7512155', '7511236', '7605624', '7660772', '25349750']

  let profileURLs = {
    '7511836': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/ray_blog.gif', 'name': 'Ray' },
    '7511899': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/beef_blog.gif', 'name': 'Roast Beef' },
    '7511767': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/pat_blog.gif', 'name': 'Pat' },
    '7511919': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/teodor_blog.gif', 'name': 'Téodor' },
    '7512085': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/philippe_blog.gif', 'name': 'Phillipe' },
    '7512001': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/cornelius_one_thm.jpg', 'name': 'Cornelius' },
    '7512130': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/lyle_blog.gif', 'name': 'Lyle' },
    '7512155': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/molly_blog.gif', 'name': 'Molly' },
    '7511236': { 'profilePicURL': 'https://upload.wikimedia.org/wikipedia/en/0/09/Achewood.png', 'name': 'Chris' },
    '7605624': { 'profilePicURL': 'https://static.wikia.nocookie.net/villains/images/3/33/Nicepete.jpg', 'name': 'Nice Pete' },
    '7660772': { 'profilePicURL': 'http://www.achewood.com/rsrc/img/charley_blog.gif', 'name': 'Little Nephew' },
    '25349750': { 'profilePicURL': 'https://m.media-amazon.com/images/M/MV5BMWY4ODcyZWEtNWU5Yi00YjViLTgzOTYtYjY4YzBhNzJlM2QwXkEyXkFqcGdeQXVyMTEwODg2MDY@._V1_.jpg', 'name': 'Emerill' },
  }

  if (blogPostCache.length === 0) {
    console.log('doing initial API call')
    for (let i = 0; i < blogIDs.length; i++) {
      allRequests.push(getPosts(blogIDs[i]))
    }

    Promise.all(allRequests).then(characters => {
      blogPostCache = characters
      for (let i = 0; i < characters.length; i++) { //characters[i] is the current character's blog
        //console.log('processing blog number', characters[i].data.items[0].blog.id)

        for (let j = 0; j < characters[i].data.items.length; j++) { //items[j] is the current blog post
          //console.log('processing post #', characters[i].data.items[j].id)
          let requestedDate = new Date(req.headers.referencedate)
          let currentBlogDate = new Date(characters[i].data.items[j].updated)

          if (datesAreOnSameDay(requestedDate, currentBlogDate)) {
            //console.log('🗄', requestedDate, ' and ', currentBlogDate, ' are a match!')
            characters[i].data.items[j].profileURL = profileURLs[characters[i].data.items[j].blog.id]
            matchingBlogPosts.push(characters[i].data.items[j])
          }
        }
      }
      res.status(200).send(matchingBlogPosts)
    })
  } else {
    console.log('getting blog posts from cache')
    for (let i = 0; i < blogPostCache.length; i++) { //blogPostCache[i] is the current character's blog
      //console.log('processing blog number', blogPostCache[i].data.items[0].blog.id)

      for (let j = 0; j < blogPostCache[i].data.items.length; j++) { //items[j] is the current blog post
        //console.log('processing post #', blogPostCache[i].data.items[j].id)
        let requestedDate = new Date(req.headers.referencedate)
        let currentBlogDate = new Date(blogPostCache[i].data.items[j].updated)

        if (datesAreOnSameDay(requestedDate, currentBlogDate)) {
          //console.log('🗄', requestedDate, ' and ', currentBlogDate, ' are a match!')
          blogPostCache[i].data.items[j].profileURL = profileURLs[blogPostCache[i].data.items[j].blog.id]
          matchingBlogPosts.push(blogPostCache[i].data.items[j])
        }
      }
    }
    res.status(200).send(matchingBlogPosts)
  }
})

app.listen(port, () => {
  console.log('Achewood Aggregator listening on port 3000')
})