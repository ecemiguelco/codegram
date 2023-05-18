import React from "react";
import { NavLink } from "react-router-dom";

function Posts(post) {
  const userProfPic = "images/" + post.post.user + ".jpg";
  // console.log(post.post);
  return (
    <div className="postMainContainer">
      <div className="postHeader">
        <NavLink
          className="headerImgContainer"
          to={post.post.user}
        >
          <img
            src={userProfPic}
            alt="User Profile Pic"
            className="postUserPic"
          ></img>
        </NavLink>
        <NavLink to={post.post.user}>
          <span className="postUserName">{post.post.user}</span>
        </NavLink>
      </div>
      <div className="postCaption">
        <p>{post.post.caption}</p>
      </div>
      <div className="postImageContainer">
        <NavLink to={post.post.user + "/" + post.post.identifier}>
          <img
            src={post.post.image}
            className="postImage"
          ></img>
        </NavLink>
      </div>
      <br></br>
      <br></br>
      <hr></hr>
    </div>
  );
}

export default Posts;
