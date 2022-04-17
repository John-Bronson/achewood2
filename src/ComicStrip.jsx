import React from 'react';

const ComicStrip = (props) => (
  <div className="comicStrip">
    {props.stripURL === '' ?
      <h1>no comic strip on this day</h1>
      :
      <img src={props.stripURL} />}
  </div>
)

export default ComicStrip