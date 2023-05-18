import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Posts from "../components/Posts";
import { BASE_URL } from "../services/services";

function Home() {
  const [postListOfFollowing, setPostListOfFollowing] = useState([]);
  const [mainUser, setMainUser] = useState({});
  const [followedUsersFitler, setFollowedUsers] = useState([]);

  useEffect(() => {
    axios
      .get(BASE_URL + "search?name=" + "Miguel")
      .then((response) => {
        setMainUser(response.data[0]);
        setFollowedUsers(response.data[0].following);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (followedUsersFitler.length > 0) {
      const apiCalls = followedUsersFitler.map((name) => {
        return axios.get(BASE_URL + name);
      });

      Promise.all(apiCalls)
        .then((responses) => {
          const posts = responses.reduce((accumulator, currentValue) => [...accumulator, ...currentValue.data], []);
          setPostListOfFollowing(posts);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [followedUsersFitler]);

  return (
    <>
      {!followedUsersFitler.length ? (
        <div className="initialMsgsContainer">
          <p className="initialMsgs">Post from people you follow will be shown here...</p>
          <p className="initialMsgs">
            Go to <strong>Search</strong>, to find someone to follow
          </p>
          <p className="initialMsgs">you can also...</p>
          <p className="initialMsgs">
            Post your latest techventure in <strong>New Post</strong>
          </p>
        </div>
      ) : (
        postListOfFollowing
          ?.sort((a, b) => {
            return a.chronoId - b.chronoId;
          })
          .reverse()
          .map((post, index) => {
            return (
              <div
                key={index}
                className="postContainer"
              >
                <Posts post={post} />
              </div>
            );
          })
      )}
    </>
  );
}

export default Home;
