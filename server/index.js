const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')
const { API_KEY } = require('../config.js')
const { serverPort } = require('../config.js')

let comicsArchive = require('../comicsArchive.js')

// const { getContent } = require('../database/index.js')

//const fs = require('fs/promises')
//const puppeteer = require('puppeteer')


//const port = serverPort

app.use(express.static(__dirname + '/../dist'));
app.use(express.json());
app.use(cors())

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate()

let comicsCache = []
let blogPostCache = []

// This code uses puppeteer to scrape a list of comics from the achewood
// archive page (list.php) and formats it for use elsewhere. For now I'm
// using an archived version of this data because I had issues getting
// Puppeteer running on an AWS EC2 instance. I plan on returning to using
// this code when I can get puppeteer to work, because I also want to scrape
// the alt-text from the comics - but only when a user accesses it. I want to
// avoid hitting Achewood.com with almost 2000 requests at once - and I also
// like that the site grabs the comic list when the server starts up because I
// don't like the implication that no new strips will ever be posted :(
//
// async function getComics() {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
//   await page.goto('https://achewood.com/list.php')

//   const comicsData = await page.evaluate(() => {
//     const comicsArray = Array.from(document.querySelectorAll('dd > a')).map((link) => {
//       const date = link.href.split('date=')[1] // produces something like '10012001'
//       let jsDate = new Date(date.substring(4), date.substring(0, 2) - 1, date.substring(2, 4), 12, 0, 0)
//       return [jsDate.toString(), link.text, link.href]
//     });

//     return comicsArray;
//   });

//   //console.log(comicsData)
//   await browser.close()

//   return comicsData
// }

// getComics().then((data) => {
//   comicsCache = data
//   console.log('comicsCache is ', comicsCache)
//   fs.writeFile('titles.txt', JSON.stringify(comicsCache))
//   console.log('comicsCache is loaded up!')
// })

function getPosts(blogID) {
  return axios({
    method: 'get',
    url: `https://www.googleapis.com/blogger/v3/blogs/${blogID}/posts?key=${API_KEY}&maxResults=200`,
    headers: {}
  })
}

function convertStripURL(dateString) {
  let date = new Date(dateString[0])
  let formattedDate
  let formattedMonth

  date.getDate() < 10 ? formattedDate = '0' + date.getDate().toString() : formattedDate = date.getDate()
  date.getMonth() < 9 ? formattedMonth = '0' + (date.getMonth() + 1).toString() : formattedMonth = date.getMonth() + 1

  return `https://achewood.com/comic.php?date=${formattedMonth}${formattedDate}${date.getFullYear()}`
}

function getComicFromDate(date) {
  //getContent(date)
  for (i = 0; i < comicsArchive.length; i++) {
    if (datesAreOnSameDay(date, new Date(comicsArchive[i][0]))) {

      return convertStripURL(comicsArchive[i])

      //console.log('good match, returning', comicsCache[i][2])
      //return comicsCache[i][2] //needs to be converted to image URL
    }
  }
  return ''
}

app.get('/strip/', (req, res) => {
  convertedDate = new Date(req.headers.referencedate)
  res.status(200).send(getComicFromDate(convertedDate))
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

app.listen(serverPort, () => {
  console.log(`Achewood Aggregator listening on port ${serverPort}`)
})