import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../services/services";
let newPost = {
  user: "Miguel",
  identifier: "",
  chronoId: "",
  image: "",
  caption: "",
  likes: "",
  comments: [],
};

const regex = /^images\//;

function NewPost() {
  const [postList, setPostList] = useState([]);
  const [postCaption, setPostCaption] = useState(newPost.caption);
  const [postImageLink, setPostImageLink] = useState(newPost.image);
  const navigate = useNavigate();
  const [err, setErrMsg] = useState("");

  useEffect(() => {
    if (postList) {
      axios
        .get(BASE_URL + "Miguel")
        .then((response) => {
          setPostList(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  const axiosPostNewPost = async (post) => {
    const response = await axios.post("http://localhost:42069/new-post", {
      ...post,
    });
    return response;
  };

  const addNewPost = (e) => {
    try {
      e.preventDefault();
      if (postCaption.trim().length === 0) {
        setErrMsg("Fields can't be blank");
        return;
      }
      if (postImageLink.trim().length === 0) {
        setErrMsg("Fields can't be blank");
        return;
      }
      if (!regex.test(postImageLink)) {
        setErrMsg("Invalid image link");
        return;
      }

      let myTotalPostsNo = postList.filter((item) => item.user === "Miguel").length;

      const addThisPost = {
        ...newPost,
        caption: postCaption,
        identifier: postImageLink.split("/")[postImageLink.split("/").length - 1].split(".")[0],
        image: postImageLink,
        chronoId: myTotalPostsNo + 1,
      };
      axiosPostNewPost(addThisPost);

      navigate("/Miguel");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form
        className="newPostForm"
        onSubmit={addNewPost}
      >
        <input
          className="postCaptionInput"
          type="text"
          placeholder="Add caption..."
          onChange={(e) => {
            setErrMsg("");
            setPostCaption(e.target.value);
          }}
        ></input>
        <input
          className="postImageInput"
          type="text"
          placeholder="Add image link..."
          onChange={(e) => {
            setErrMsg("");
            setPostImageLink(e.target.value);
          }}
        ></input>
        {/* image link validation */}
        <button
          type="submit"
          className="newPostButton"
        >
          Add Post
        </button>
        <br></br>
      </form>
      {err.length === 0 ? null : <div>{err}</div>}
    </div>
  );
}

export default NewPost;
