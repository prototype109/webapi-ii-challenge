const express = require('express');

const postRouter = require('./post-router');

const server = express();

server.use(express.json());
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
    res.send('On Default Route');
})

module.exports = server;