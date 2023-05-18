import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function CommentsList({ user, identifier }) {
  const BASE_URL = "http://localhost:42069/";
  const [commentList, setCommentList] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [getComments, setGetComments] = useState(false);

  useEffect(() => {
    axios
      .get(BASE_URL + user + "/" + identifier)
      .then((response) => {
        setCommentList(response.data);
      })
      .catch((err) => console.log(err));
    if (getComments === true) {
      setGetComments(false);
    }
  }, [user, getComments]);

  const axiosNewComment = async (comment) => {
    const response = await axios.post(BASE_URL + user + "/" + identifier, {
      ...comment,
    });
    setGetComments(true);
  };

  const addNewComment = (e) => {
    e.preventDefault();
    if (commentText === "") {
      console.log("Comment can not be empty");
      return;
    }

    const addThisComment = {
      userID: "Miguel",
      postID: identifier,
      text: commentText,
    };
    axiosNewComment(addThisComment);
    setCommentText("");
  };

  return (
    <div className="commentSection">
      <form onSubmit={addNewComment}>
        <input
          className="commentInput"
          type="text"
          value={commentText}
          placeholder="Write a comment..."
          onChange={(e) => {
            setCommentText(e.target.value);
          }}
        ></input>
      </form>
      <div className="commentsContainer">
        {commentList.map((comment, index) => {
          return (
            <div
              key={index}
              className="commentsBox"
            >
              <NavLink
                className="commentUserContainer"
                to={`/${comment.userID}`}
              >
                <img
                  className="commentUserPic"
                  src={`/images/${comment.userID}.jpg`}
                  alt={`images/${comment.userID}.jpg`}
                ></img>
              </NavLink>

              <div className="commentText">
                <p>{comment.text}</p>
              </div>
            </div>
          );
        })}

        {/* map here */}
      </div>
    </div>
  );
}

export default CommentsList;
