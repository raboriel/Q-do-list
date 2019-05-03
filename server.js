// USE DOTENV TO IMPORT
require('dotenv').config();

//Dependencies
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const app = express();
const session = require('express-session')


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

// Routes
app.get('/', (req, res) => {
  // res.send('index route')
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  })
})

app.get('/main', (req, res)=>{
  res.render('main.ejs', {
    currentUser: req.session.currentUser
  })
})


const thingsController = require('./controllers/things');
app.use('/things', thingsController);
// users controller
const userController = require('./controllers/users_controller.js')
app.use('/users', userController)

// sessions controller
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
