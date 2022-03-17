import React from 'react';

const BlogPost = (props) => (
  <div className="blogPost">
    <h3 onClick={() => console.log(props)}>{props.currentPost.title}</h3>
    <img src={props.currentPost.profileURL.profilePicURL} />
    <div dangerouslySetInnerHTML={{ __html: props.currentPost.content }} />
    <p>Posted by {props.currentPost.profileURL.name} at {props.currentPost.published}</p>
    <a href={props.currentPost.url}>link to original post</a>
  </div>
)

export default BlogPost