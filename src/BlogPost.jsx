import React from 'react';

const BlogPost = (props) => (
  <div>
    <h2 onClick={() => console.log(props)}>{props.currentPost.title}</h2>
    <div dangerouslySetInnerHTML={{ __html: props.currentPost.content }} />
  </div>
)

export default BlogPost