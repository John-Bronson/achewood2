import React from 'react';
import ReactDOM from 'react-dom';
var axios = require('axios');
import ComicStrip from './ComicStrip.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate : '2004-07-02T12:00:00.000Z'
    }
    this.getTodayPostsRay = this.getTodayPostsRay.bind(this)
  }

  getTodayPostsRay() {
    axios({
      method: 'get',
      url: 'http://localhost:3000/backend/',
      headers: {
        'Content-Type': 'application/json',
        'referencedate': this.state.currentDate
      }
    }).then((response) => {
      console.log(response.data);
    })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
      <h1 onClick={() => this.getTodayPostsRay()}>Hello World!</h1>
      <ComicStrip />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));