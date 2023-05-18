import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function PostDispay({ selectedPosts, profilename }) {
  return selectedPosts
    .sort((a, b) => a.chronoId - b.chronoId)
    .reverse()
    .map((post, index) => (
      <NavLink
        key={index}
        className="mainPostDispInUserPage"
        to={`/${profilename}/${post.identifier}`}
      >
        <img
          src={post.image}
          className="userPostImage"
        ></img>
      </NavLink>
    ));
}

export default PostDispay;
