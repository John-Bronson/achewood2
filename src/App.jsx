import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');

import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";

import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ComicStrip from './ComicStrip.jsx'
import BlogPost from './BlogPost.jsx'

const { API_KEY, serverURL } = require('../config.js')

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date('2004-07-01T15:00:00.000Z'))
  const [currentBlogPosts, setCurrentBlogPosts] = useState([])
  const [currentStrip, setCurrentStrip] = useState('http://achewood.com/comic.php?date=07012004')

  useEffect(() => {
    getTodayStrip()
    getTodayBlogPosts()
  }, [currentDate])

  function handleKeyPress(event) {
    console.log('user pressed', event.code)
    if (event.code === 'ArrowRight') {
      console.log('yeah! right key!');
      let tempDate = new Date(currentDate)
      tempDate.setDate(tempDate.getDate() + 1)
      setCurrentDate(tempDate)
    }
    if (event.code === 'ArrowLeft') {
      console.log('yeah! left key!');
      let tempDate = new Date(currentDate)
      tempDate.setDate(tempDate.getDate() - 1)
      setCurrentDate(tempDate)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const getTodayStrip = () => {
    console.log(`getting today's strip`)
    axios({
      method: 'get',
      url: `${serverURL}/strip/`,
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
      url: `${serverURL}/blogs/`,
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

  return (
    <div>
      <div className="App">
        <Header />
        <hr className="section-divider" />
        <div id="body">
          <div id="comicSection">
            <div className="dateControls">
              <div onClick={() => handleSingleDayClick(-1)}> &laquo; Prev Date</div>
              <div>
                <DatePicker
                  selected={currentDate}
                  onChange={(date) => setCurrentDate(date)}
                />
              </div>
              <div onClick={() => handleSingleDayClick(1)} >Next Date &raquo; </div>
            </div>

            <ComicStrip stripURL={currentStrip} />
            {currentBlogPosts.length === 0 ?
              <h1>no blog posts on this day</h1>
              :
              currentBlogPosts.map(currentPost => <BlogPost currentPost={currentPost} key={currentPost.id} />)
            }
            <img src="https://achewood.com/img/achewood_buy_print_button_v2.png" width="350"></img>
          </div>
        </div>
        <Footer />
      </div >
    </div >
  )
}

ReactDOM.render(<App />, document.getElementById('app'));