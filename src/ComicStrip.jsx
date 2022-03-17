import React from 'react';

const ComicStrip = (props) => (
  <div className="comicStrip">
    {/* <h2 onClick={() => console.log(props)}>Comic</h2> */}
    <img src={props.stripURL} />
  </div>
)

export default ComicStrip