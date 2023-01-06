const express = require('express');
const router = express.Router();

let follows = require('./data/follows.json');
let howls = require('./data/howls.json');
let users = require('./data/users.json');

//router.use(frontendRouter);
router.use(express.json());

//Get user object from given username (authenticate)
router.get('/users/:username', (req, res) => {
    const username = req.params.username;
    let user = users.find(user => user.username == username);
    if (user) {
        res.json(user);
    } else {
        //Should trigger in login.js instead
        alert('User not Found');
    }
});

//Get user object from given userId
router.get('/users/Id/:userId', (req, res) => {
    const userId = req.params.userId;
    let user = users.find(user => user.id == userId);
    if (user) {
        res.json(user);
    } else {
        //Should trigger in login.js instead
        alert('User not Found');
    }
});

//Create a new howl
router.post('/howls', (req, res) => {
    let newHowl = req.body;
    howls.push(newHowl);
    res.json(newHowl);
});

//Get howls by a specific user
/** 
router.get('howls/:userId', (req, res) => {
    const userId = req.params.userId;
    let userHowls = howls.filter(howl => howl.userId == userId);
    res.json(userHowls);
});
*/

//Get IDs of users followed by given user
router.get('/follows/:userId', (req, res) => {
    const userId = req.params.userId;
    let userFollows = follows[userId].following;
    res.json(userFollows);
});

//Get IDs of users following a given user
router.get('/follows/followers/:userId', (req, res) => {
    const userId = req.params.userId;
    let listOfKeys = Object.keys(follows);
    let listOfFollowers = [];
    for (var i of listOfKeys) {
        if (inArray(userId, follows[i].following)) {
            listOfFollowers.push(i);
        }
    }
    res.json(listOfFollowers);
})

//Get all howls
router.get('/howls', (req, res) => {
    res.json(howls);
});

//Get howls posted by given list of users
router.get('/howls/:users', (req, res) => {
    //user list: find these users howls
    const users = req.params.users.split(',');
    let allHowls = howls.filter(howl => inArray(howl.userId, users));

    //Sort howls by reverse date
    allHowls.sort(function (a, b) {
        return new Date(b.datetime) - new Date(a.datetime);
    });

    res.json(allHowls);
});

//Follow a user
router.put('/follows/follow/:userId', (req, res) => {
    follows[req.params.userId].following.push(req.body.viewingUserId);
});

//Unfollow a user
router.delete('/follows/unfollow/:userId', (req, res) => {
    const viewingUserId = req.body.viewingUserId;
    const authenticatedUserId = req.params.userId;
    let authenticatedUserFollows = follows[authenticatedUserId].following;
    let index = authenticatedUserFollows.indexOf(viewingUserId);
    authenticatedUserFollows.splice(index, 1);
});

function inArray(needle, haystack) {
    for (let i = 0; i < haystack.length; i++) {
        if (haystack[i] == needle)
            return true;
    }
    return false;
}

module.exports = router;