const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')
const bcrypt = require('bcrypt')


sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs')
})

// login user
sessions.post('/', (req, res) => {
    console.log(req.body);
    User.findOne({username: req.body.username}, (error, foundUser) => {
        if (foundUser) {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.currentUser = foundUser;
                res.redirect('/main');
            } else {
                res.send('<a href="/">wrong password</a>');
            }
        } else {
            res.send('<a href="/">user not exist</a>');
        }
    });
});



module.exports = sessions
