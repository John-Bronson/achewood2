import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
import styled from 'styled-components'

import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ComicStrip from './ComicStrip.jsx'
import BlogPost from './BlogPost.jsx'

const { API_KEY } = require('../config.js')
//TODO: Material UI for calendar and date picker?

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2004-07-01T15:00:00.000Z'))
  const [currentBlogPosts, setCurrentBlogPosts] = useState([])
  const [currentStrip, setCurrentStrip] = useState('http://achewood.com/comic.php?date=07012004')

  useEffect(() => {
    getTodayStrip()
    getTodayBlogPosts()
  }, [currentDate])

  const getTodayStrip = () => {
    console.log('getting blog posts')
    axios({
      method: 'get',
      url: 'http://ec2-23-22-249-229.compute-1.amazonaws.com/strip/',
      headers: {
        'Content-Type': 'application/json',
        'referencedate': currentDate.toString()
      }
    }).then((response) => {
      console.log('requesting new strip with date', currentDate)
      console.log('response received for new strip. it is', response.data)
      setCurrentStrip(response.data)
    })
      .catch((error) => {
        console.log(error);
      });
  }

  const getTodayBlogPosts = () => {
    console.log('getting blog posts')
    axios({
      method: 'get',
      url: 'http://ec2-23-22-249-229.compute-1.amazonaws.com/blogs/',
      headers: {
        'Content-Type': 'application/json',
        'referencedate': currentDate
      }
    }).then((response) => {
      console.log('response received. it is', response.data)
      //todo: Convert date string to date object for pretty display in blog posts
      //from server side: characters[i].data.items[j].publishedObject = new Date(characters[i].data.items[j].published)
      setCurrentBlogPosts(response.data)
    })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSingleDayClick = (days) => {
    let tempDate = new Date(currentDate)
    tempDate.setDate(tempDate.getDate() + days)
    setCurrentDate(tempDate)
    // setCurrentDate(new Date(currentDate).setDate(tempDate.getDate() + days))
  }

  function getPosts(blogID) {
    return axios({
      method: 'get',
      url: `https://www.googleapis.com/blogger/v3/blogs/${blogID}/posts?key=${API_KEY}&maxResults=200`,
      headers: {}
    })
  }


  return (
    <div>
      <div className="App">
        <Header />
        <hr className="section-divider" />
        <div id="body">
          <div id="comicSection">
            <div className="dateControls">
              <div onClick={() => handleSingleDayClick(-1)}> &laquo; </div>
              <div>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getDate()}, {currentDate.getFullYear()}</div>
              <div onClick={() => handleSingleDayClick(1)} >&raquo; </div>
            </div>

            <ComicStrip stripURL={currentStrip} />
            {currentBlogPosts.length === 0 ?
              <h1>no blog posts on this day</h1>
              :
              currentBlogPosts.map((currentPost) => (
                <BlogPost currentPost={currentPost} key={currentPost.id} />
              ))}
            <img src="https://achewood.com/img/achewood_buy_print_button_v2.png" width="350"></img>
          </div>
        </div>
        <Footer />
      </div >
    </div >
  )
}

ReactDOM.render(<App />, document.getElementById('app'));