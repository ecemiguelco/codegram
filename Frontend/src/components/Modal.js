import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import CommentsList from "./CommentsList";

function Modal() {
  const { profilename, postname } = useParams();
  const [selectedPost, setSelectedPost] = useState({});
  const BASE_URL = "http://localhost:42069/";

  useEffect(() => {
    if (!selectedPost.identifier) {
      axios
        .get(BASE_URL + profilename)
        .then((response) => {
          setSelectedPost(response.data.filter((post) => post.identifier === postname)[0]);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedPost]);

  return (
    <>
      <div className="modalContainer">
        <div className="postModal">
          <NavLink to={`/`}>
            <button>Home</button>
          </NavLink>
          <div className="modalCaption">
            <p>{selectedPost.caption}</p>
          </div>
          <div className="modalImageContainer">
            <img
              src={`/${selectedPost.image}`}
              className="modalImage"
            ></img>
          </div>
          <CommentsList
            user={selectedPost.user}
            identifier={selectedPost.identifier}
          />
        </div>
      </div>
      <NavLink
        to={`/${profilename}`}
        className="bgClickModal"
      ></NavLink>
    </>
  );
}

export default Modal;
