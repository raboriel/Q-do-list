// ============================
// DEPENDENCIES
// ============================
const express = require('express');
const things = express.Router();

// ============================
// MODELS
// ============================
const Things = require('../models/things');

// ============================
// GET ROUTES
// ============================
// -- index route
things.get('/main', (req, res) => {
  res.render('main.ejs', {
    currentUser: req.session.currentUser
  })
})
// ============================
// ACTION ROUTES
// ============================
// -- create route




// -- delete route




// ============================
// EXPORT
// ============================
module.exports = things;
