import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostDispay from "../components/PostDispay";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../services/services";

const updateFollowers = async (user) => {
  try {
    const response = await axios.patch(BASE_URL + "Miguel", user);
  } catch (err) {
    console.log(err);
  }
};

function UserPage() {
  const BASE_URL = "http://localhost:42069/";
  let { profilename } = useParams();

  const [mainUser, setMainUser] = useState({});
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedPosts, setSelectedPost] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [isSelectedUserFollowed, setSelectedUserFollowed] = useState();
  const [clickedFollowButton, setClickFollowButton] = useState(false);

  useEffect(() => {
    axios
      .get(BASE_URL + profilename)
      .then((response) => {
        setSelectedPost(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [profilename, clickedFollowButton, mainUser]);

  useEffect(() => {
    axios
      .get(BASE_URL + "search?name=" + profilename)
      .then((response) => {
        setSelectedUser(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [profilename]);

  useEffect(() => {
    axios
      .get(BASE_URL + "search?name=" + "Miguel")
      .then((response) => {
        setMainUser(response.data[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFollowers(selectedUser.follower);
      setFollowingUsers(selectedUser.following);
    }
  }, [selectedUser, clickedFollowButton]);

  useEffect(() => {
    if (mainUser.following) {
      setSelectedUserFollowed(mainUser.following?.includes(profilename));
      return;
    }
  }, [mainUser.following, profilename, mainUser]);

  const numberOfPosts = selectedPosts.length;

  const userPicLink = "images/" + profilename + ".jpg";

  const refreshFollows = () => {
    setFollowers(selectedUser.follower);
    setFollowingUsers(selectedUser.following);
  };

  const handleFollowUnfollow = async (type, payload) => {
    switch (type) {
      case "ADD_FOLLOW":
        const userToAdd = {
          user: payload,
          toDo: type,
        };
        await updateFollowers(userToAdd);
        setSelectedUserFollowed(true);
        setFollowers([...followers, mainUser.user]);
        break;
      case "REMOVE_FOLLOW":
        const userToRemove = {
          user: payload,
          toDo: type,
        };
        await updateFollowers(userToRemove);
        setSelectedUserFollowed(false);
        setFollowers(followers.filter((follower) => follower !== mainUser.user));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="userPageHeader">
        <div className="userPageProfPic">
          <img
            src={userPicLink}
            className="userPageProfilePic"
          ></img>
        </div>
        <div className="userPageDetails">
          <div className="userPageNameAndFollow">
            <div className="userPageDetName">{selectedUser.user}</div>
            {profilename !== "Miguel" ? (
              isSelectedUserFollowed ? (
                <button
                  type="submit"
                  className="followingButton"
                  onClick={() => {
                    handleFollowUnfollow("REMOVE_FOLLOW", profilename);
                    refreshFollows();
                  }}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  type="submit"
                  className="followingButton"
                  onClick={() => {
                    handleFollowUnfollow("ADD_FOLLOW", profilename);
                    refreshFollows();
                  }}
                >
                  Follow
                </button>
              )
            ) : null}
          </div>
          <div className="userPageDetPoFoFo">
            <div className="numPosts">
              <span className="noInDetails">{numberOfPosts}</span>
              <span className="postDetDisplay">{numberOfPosts > 1 ? "posts" : "post"}</span>
            </div>
            <div className="numPosts">
              <span className="noInDetails">{followers?.length}</span>
              <span className="postDetDisplay">{followers?.length > 1 ? "followers" : "follower"}</span>
            </div>
            <div className="numPosts">
              <span className="noInDetails">{followingUsers?.length}</span>
              <span className="postDetDisplay">following</span>
            </div>
          </div>
        </div>
      </div>
      <div className="postDisplayContainer">
        <div>Posts</div>
        <div className="postDisplays">
          <PostDispay
            selectedPosts={selectedPosts}
            profilename={profilename}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default UserPage;
