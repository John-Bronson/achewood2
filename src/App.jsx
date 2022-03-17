import React from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
import ComicStrip from './ComicStrip.jsx'
import BlogPost from './BlogPost.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: '2004-07-01T12:00:00.000Z',
      currentBlogPosts: [],
      currentStrip: 'http://achewood.com/comic.php?date=07012004'
    }
    //this.getTodayPostsRay = this.getTodayPostsRay.bind(this)
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
    tempDate.setDate(tempDate.getDate()+1)
    // console.log(JSON.stringify(tempDate))
    // let stringifiedNewDate = JSON.stringify(tempDate)
    // console.log(stringifiedNewDate)

    this.setState({
      currentDate: tempDate
    })


  }

  handlePrevDayClick() {
    let tempDate = new Date(this.state.currentDate)
    console.log(tempDate)
    tempDate.setDate(tempDate.getDate()-1)
    // console.log(JSON.stringify(tempDate))
    // let stringifiedNewDate = JSON.stringify(tempDate)
    // console.log(stringifiedNewDate)

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

  getTodaysContents() {
    this.getTodayStrip()
    this.getTodayBlogPosts()
  }

  render() {
    return (
      <div className="App">
        <h1>Achewood Aggregator Machine v0.01</h1>
        <div className="dateControls">
          <div onClick={() => this.handlePrevDayClick()}><h3>Previous Day</h3></div>
          <div><h3>{JSON.stringify(this.state.currentDate)}</h3></div>
          <div onClick={() => this.handleNextDayClick()} ><h3>Next Day</h3></div>
        </div>

        <ComicStrip stripURL={this.state.currentStrip} />
        {this.state.currentBlogPosts.map((currentPost) => (
          <BlogPost currentPost={currentPost} key={currentPost.id} />
        ))}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));