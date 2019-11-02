const express = require("express");

const db = require("./data/db");

const postRouter = express.Router();

postRouter.post("/", (req, res) => {
  const reqBody = req.body;

  db.insert(reqBody)
    .then(post => {
      if (reqBody.title && reqBody.contents) res.status(201).json({ reqBody });
      else
        res
          .status(400)
          .json({
            errorMessage: "Please provide title and contents for the post."
          });
    })
    .catch(err => {
      res
        .status(500)
        .json({
          error: "There was an error while saving the post to the database"
        });
    });
});

postRouter.post("/:id/comments", async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;
  let postId = { error: "error" };

  try {
    postId = await db.insertComment({ ...reqBody, post_id: id });
    res.status(201).json({ reqBody });
  } catch {
    if (reqBody.text) {
      if (postId.err)
        res
          .status(500)
          .json({
            error: "There was an error while saving the comment to the database"
          });
      else
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
    } else
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
  }
});

postRouter.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

postRouter.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const postArr = await db.findById(id);
    if (postArr.length > 0) res.status(200).json(postArr);
    else
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
  } catch {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

postRouter.get("/:id/comments", async (req, res) => {
  const id = req.params.id;

  try {
    const commentArr = await db.findPostComments(id);

    console.log("COMMENT ARR: ", commentArr);

    if (commentArr.length > 0) res.status(200).json(commentArr);
    else
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
  } catch {
    res
      .status(500)
      .json({ error: "The comments information could not be retrieved." });
  }
});

postRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const postArr = await db.findById(id);
    if (postArr.length > 0) {
      db.remove(id)
        .then(deletedPost => {
          res.status(200).json({ postArr });
        })
        .catch(err => {
          res.status(500).json({ message: "Should not be getting here!!!!" });
        });
    } else
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
  } catch {
    res.status(500).json({ error: "The post could not be removed" });
  }
});

postRouter.put("/:id", async (req, res) => {
  const reqBody = req.body;
  const id = req.params.id;

  try {
    const postEdit = await db.update(id, reqBody);

    console.log("POSTEDIT: ", postEdit);
    if (postEdit) res.status(200).json({ reqBody });
    else {
      if (reqBody.title && reqBody.contents) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else
        res
          .status(400)
          .json({
            errorMessage: "Please provide title and contents for the post."
          });
    }
  } catch {
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});

module.exports = postRouter;
