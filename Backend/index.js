const express = require("express");
const helmet = require("helmet");
const { config } = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/users");
const Post = require("./models/posts");
const Comment = require("./models/comments");

config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const port = process.env.PORT;
const database = process.env.DATABASE;

//Connection to MongoDB
mongoose
  .connect(`mongodb+srv://${dbHost}:${dbPort}/${database}`, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const app = express();

// Middleware to parse incoming request bodies
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add routes here
app.post("/:user/:postID", async (req, res) => {
  try {
    const { user, postID } = req.params;
    const currentPostComments = await Comment.find({ postID: postID });
    const lenghtOfComments = currentPostComments.length;

    const newComment = new Comment({
      userID: req.body.userID,
      postID: req.body.postID,
      chronoId: lenghtOfComments + 1,
      text: req.body.text,
      active: true,
    });
    await newComment.save();
    res.status(200).send({ message: "Commented successfully." });
  } catch (err) {
    res.status(500).send("Error.");
  }
});

app.post("/new-post", async (req, res) => {
  try {
    // const inputPost = req.body;
    // const myPostsLength = (await Post.find({ user: req.body.user })).length;

    const newPost = new Post({
      user: req.body.user,
      identifier: req.body.identifier,
      chronoId: req.body.chronoId,
      caption: req.body.caption,
      image: req.body.image,
      likes: "",
    });
    await newPost.save();
    res.status(200).send({ message: "Post created successfully." });
  } catch (err) {
    res.status(500).send("Error.");
  }
});

app.patch("/:user/:postID", async (req, res) => {
  try {
    const { user, postID } = req.params;
    const selectedPost = await Post.findByIdAndUpdate(
      postID,
      {
        caption: req.body.caption,
        image: req.body.image,
      },
      { new: true }
    );
    res.json(selectedPost);
    return;
  } catch (err) {
    res.status(500).send("Error.");
  }
});

app.patch("/:user", async (req, res) => {
  try {
    const { user } = req.params;
    if (req.body.toDo === "ADD_FOLLOW") {
      const selectedUser = await User.findOneAndUpdate(
        { user: "Miguel" },
        {
          $push: { following: { $each: [req.body.user], $position: 0 } },
        },
        { new: true }
      );
      const addToFollower = await User.findOneAndUpdate(
        { user: req.body.user },
        {
          $push: { follower: { $each: ["Miguel"], $position: 0 } },
        },
        { new: true }
      );
      return res.status(200).end();
    }
    if (req.body.toDo === "REMOVE_FOLLOW") {
      const removeMe = req.body.user;
      const selectedUser = await User.findOneAndUpdate(
        { user: "Miguel" },
        {
          $pull: { following: removeMe },
        },
        { new: true }
      );
      const removeFromFollower = await User.findOneAndUpdate(
        { user: req.body.user },
        {
          $pull: { follower: "Miguel" },
        },
        { new: true }
      );
      return res.status(200).end();
    }
    res.status(200).end();
  } catch (err) {
    res.status(500).send("Error.");
  }
});

app.get("/", async (req, res) => {
  try {
    const mainUser = await User.find({ user: "Miguel" });
    if (mainUser[0].following.length) {
      let followingPostList = [];
      Promise.all(
        mainUser[0].following.map(async (e) => {
          return await Post.find({ user: e });
        })
      ).then((data) => {
        console.log(data);
        const finalData = data.flat().sort((a, b) => b.chronoId - a.chronoId);
        res.json(finalData);
      });
      return;
    }
    res.status(204);
  } catch (err) {
    res.status(500).send("Error.");
  }
});

app.get("/search", async (req, res) => {
  try {
    if (Object.keys(req.query).length) {
      if ("name" in req.query) {
        const { name } = req.query;
        if (!name.length) {
          res.status(404).end("Input a username to search.");
          return;
        }
        const searchedUser = await User.find({ user: name });
        searchedUser.length ? res.json(searchedUser) : res.status(204).end("No User Found.");
        return;
      }
      res.status(404).send("Incorrect query");
      return;
    }
    const responseUsers = await User.find().select("user image follower following").exec();

    res.status(200).json(responseUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving user.");
  }
});

app.get("/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const currentUser = await User.find({ user: user });
    if (currentUser) {
      const selectedPosts = await Post.find({ user: user });
      res.status(200).json(selectedPosts);
      return;
    }
    res.status(404).end("No User Found.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving user.");
  }
});

app.get("/:user/:postID", async (req, res) => {
  try {
    const { postID } = req.params;
    const postComments = await Comment.find({ postID: postID });
    res.status(200).json(postComments);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving user.");
  }
});

//Handling unknown routes
app.use((req, res, next) => {
  return next(new HttpError("Route not found", 404));
});

//Error handling middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  //if no header was sent
  res.status(error.code || 500).json({ message: error.message || "An error occured!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
