import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
import styled from 'styled-components'

import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ComicStrip from './ComicStrip.jsx'
import BlogPost from './BlogPost.jsx'

//TODO: Material UI for calendar and date picker?

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2004-07-01T15:00:00.000Z'))
  const [currentBlogPosts, setCurrentBlogPosts] = useState([])
  const [currentStrip, setCurrentStrip] = useState('http://achewood.com/comic.php?date=07012004')

  // useEffect(() => {
  //   getTodaysContents()
  // })

  const getTodayStrip = () => {
    console.log('getting blog posts')
    axios({
      method: 'get',
      url: 'http://localhost:3000/strip/',
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
      url: 'http://localhost:3000/blogs/',
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

  const getTodaysContents = () => {
    getTodayStrip()
    getTodayBlogPosts()
  }

  //       currentBlogPosts: [],
  //       currentStrip: 'http://achewood.com/comic.php?date=07012004'

  const handleSingleDayClick = (days) => {
    let tempDate = new Date(currentDate)
    tempDate.setDate(tempDate.getDate() + days)
    setCurrentDate(tempDate)
    getTodayStrip()
    getTodayBlogPosts()
  }

  return (
    <div>
      <h1>{currentDate.toString()}</h1>
      <div className="App">
        <Header />
        <hr className="section-divider" />
        <div id="body">
          <div id="comicSection">
            <div className="dateControls">
              <div onClick={() => handleSingleDayClick(-1)}> &laquo;_ </div>
              <div>{JSON.stringify(currentDate)}</div>
              <div onClick={() => handleSingleDayClick(1)} >_&raquo; </div>
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