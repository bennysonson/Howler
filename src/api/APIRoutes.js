//DEPRECATED D:
/**
const express = require('express');
const apiRouter = express.Router();

let follows = require('../data/follows.json');
let howls = require('../data/howls.json');
let users = require('../data/users.json');

apiRouter.use(express.json());

//Get username (authenticate)
apiRouter.get('/users/:username', (req, res) => {
    console.log('hi');
    const username = req.params.username;
    let user = users.find(user => user.username == username);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

module.exports = apiRouter;
*/