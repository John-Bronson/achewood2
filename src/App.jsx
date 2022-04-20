import React, { useState } from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
import styled from 'styled-components'

import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ComicStrip from './ComicStrip.jsx'
import BlogPost from './BlogPost.jsx'

const { API_KEY } = require('../config.js')

//TODO: Material UI for calendar and date picker?

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: '2004-07-01T12:00:00.000Z',
      currentBlogPosts: [],
      currentStrip: 'http://achewood.com/comic.php?date=07012004'
    }
  }

  componentDidMount() {
    let initialCurrentDate = new Date('2004-07-01T12:00:00.000Z')
    this.setState({
      currentDate: initialCurrentDate
    })

    this.getTodaysContents()
    console.log('current date at end of componentDidMount:', this.state.currentDate)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.currentDate !== prevState.currentDate) {
      this.getTodaysContents()
    }
  }

  handleNextDayClick() {
    let tempDate = new Date(this.state.currentDate)
    console.log(tempDate)
    tempDate.setDate(tempDate.getDate() + 1)
    // console.log(JSON.stringify(tempDate))
    // let stringifiedNewDate = JSON.stringify(tempDate)
    // console.log(stringifiedNewDate)

    this.setState({
      currentDate: tempDate
    })
  }

  useEffect(() => {
    getTodayStrip()
    getTodayBlogPosts()
  }, [currentDate])

    this.setState({
      currentDate: tempDate
    })
  }

  getTodayStrip() {
    console.log('getting blog posts')
    axios({
      method: 'get',
      url: 'http://localhost:3000/strip/',
      headers: {
        'Content-Type': 'application/json',
        'referencedate': this.state.currentDate
      }
    }).then((response) => {
      console.log('requesting new strip with date', this.state.currentDate)
      console.log('response received for new strip. it is', response.data)
      this.setState({
        currentStrip: response.data
      })
    })
      .catch((error) => {
        console.log(error);
      });
  }

  getTodayBlogPosts() {
    console.log('getting blog posts')
    axios({
      method: 'get',
      url: 'http://localhost:3000/blogs/',
      headers: {
        'Content-Type': 'application/json',
        'referencedate': this.state.currentDate
      }
    }).then((response) => {
      console.log('response received. it is', response.data)
      //todo: Convert date string to date object for pretty display in blog posts
      //from server side: characters[i].data.items[j].publishedObject = new Date(characters[i].data.items[j].published)

      this.setState({
        currentBlogPosts: response.data
      })
    })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSingleDayClick = (days) => {
    let tempDate = new Date(currentDate)
    tempDate.setDate(tempDate.getDate() + days)
    setCurrentDate(tempDate)
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

            <ComicStrip stripURL={this.state.currentStrip} />
            {this.state.currentBlogPosts.length === 0 ?
              <h1>no blog posts on this day</h1>
              :
              this.state.currentBlogPosts.map((currentPost) => (
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