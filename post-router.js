const express = require('express');

const db = require('./data/db');

const postRouter = express.Router();

postRouter.post('/', (req, res) => {
    const reqBody = req.body;

    db.insert(reqBody)
        .then(post => {
            if(reqBody.title && reqBody.contents)
                res.status(201).json({reqBody});
            else
                res.status(400).json({errorMessage: "Please provide title and contents for the post."});
        })
        .catch(err => {
            res.status(500).json({error: "There was an error while saving the post to the database"});
        });
});

postRouter.post('/:id/comments', (req, res) => {
    const reqBody = req.body;
    const id = req.params.id;

    db.insertComment({text: reqBody.text, post_id: id})
        .then(comment => {
            if(id){
                if(reqBody.text){
                    res.status(201).json(reqBody);
                } else{
                    res.status(400).json({errorMessage: "Please provide text for the comment."});
                }
            } else
                res.status(404).json({message: "The post with the specified ID does not exist."});
        })
        .catch(err => {
            if(reqBody.text === undefined)
                res.status(400).json({errorMessage: "Please provide text for the comment."});
            else
                res.status(500).json({error: "There was an error while saving the comment to the database"});
        });
});

postRouter.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});

module.exports = postRouter;