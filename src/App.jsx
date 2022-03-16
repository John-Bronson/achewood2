import React from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
import ComicStrip from './ComicStrip.jsx'
import BlogPost from './BlogPost.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: '2004-07-02T12:00:00.000Z',
      currentBlogPosts: []
    }
    //this.getTodayPostsRay = this.getTodayPostsRay.bind(this)
  }

  componentDidMount() {
    this.getTodaysContents()
  }

  getTodayBlogPosts() {
    axios({
      method: 'get',
      url: 'http://localhost:3000/blogs/',
      headers: {
        'Content-Type': 'application/json',
        'referencedate': this.state.currentDate
      }
    }).then((response) => {

      this.setState({
        currentBlogPosts: response.data
      })
    })
      .catch((error) => {
        console.log(error);
      });
  }

  getTodaysContents() {
    this.getTodayBlogPosts()
  }

  render() {
    return (
      <div>
        <h1>AirWolf</h1>
        <ComicStrip />
        {this.state.currentBlogPosts.map((currentPost) => (
          <BlogPost currentPost={currentPost} key={currentPost.id} />
        ))}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));