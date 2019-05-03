// USE DOTENV TO IMPORT
require('dotenv').config();

//Dependencies
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const app = express();
const session = require('express-session')
const User = require('./models/users')

// Configuration
const PORT = process.env.PORT;
const mongoURI = process.env.MONGODB_URI;

// Middleware
app.use( express.static ( 'public' ) );
app.use(methodOverride('_method'));
// parses info
app.use(express.urlencoded({extended: false}));
// configure sessions
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))


// DAtabase config and connection
mongoose.connect(mongoURI, { useNewUrlParser: true})
mongoose.connection.once('open', () => {
  console.log('connected to mongo')
});

// Listen
app.listen(PORT, ()=> console.log('auth happening on port'),( PORT))

// ============================
// GET ROUTES
// ============================
// -- index route
app.get('/', (req, res) => {
  // res.send('index route')
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  })
})

app.get('/main', (req, res) => {
  User.findOne({_id: req.session.currentUser._id}, (err, createdProduct) => {
  res.render('main.ejs', {
    currentUser: createdProduct
  })
})
})

app.get('/session_test', (req, res) =>{
  res.send(req.session)
})

// ============================
// ACTION ROUTES
// ============================
// -- Add todo Things in User's thing array
app.post('/main', (req, res) => {
  User.findOneAndUpdate({_id: req.session.currentUser._id}, {$push: { things:req.body.thing}}, (err, createdProduct) => {
    let user = req.session.currentUser
    res.redirect('/main')
    })
  })



// users controller
const userController = require('./controllers/users_controller.js')
app.use('/users', userController)

// sessions controller
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
