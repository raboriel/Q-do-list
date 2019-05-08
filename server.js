// USE DOTENV TO IMPORT
require('dotenv').config();

//Dependencies
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose')
const app = express();
const session = require('express-session')
const User = require('./models/users')
const Things = require('./models/things')
const Nothings = require('./models/nothings')
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
mongoose.set('useFindAndModify', false);
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
  // index
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  })
})
// main for to do list
app.get('/main', (req, res) => {
  // finding current user
  User.findOne({_id: req.session.currentUser._id}, (err, user) => {
    // add current user id in things
    Things.find({idForUser: req.session.currentUser._id}, (err, things) => {
      console.log(things);
      res.render('main.ejs', {
        currentUser: user,
        thingz: things
      })
    })
  })
});

// for not to do list
app.get('/nomain', (req, res) => {
  // finding current user
  User.findOne({_id: req.session.currentUser._id}, (err, user) => {
    // add current user id in things
    Nothings.find({idForUser: req.session.currentUser._id}, (err, nothings) => {
      res.render('nomain.ejs', {
        currentUser: user,
        nothings: nothings
      })
    })
  })
});

// edit nothings
app.get ( '/nomain/:id/edit' , ( req , res ) => {
  User.findOne({_id: req.session.currentUser._id}, (err, user) => {
    Nothings.findById( req.params.id , ( err , nothings ) => {
      if ( err ) { console.log ( err ); }
        res.render ( './edit.ejs' , {
          currentUser: user,
          nothings : nothings
      });
    })
  });
});


// ============================
// ACTION ROUTES
// ============================
// -- Create Things
app.post('/main', (req, res)=>{
  //add user ID into things
  req.body.idForUser = req.session.currentUser._id
    Things.create(req.body, (err, createdThings)=>{
      console.log(createdThings);
        res.redirect('/main');
      });
  });

app.post('/nomain', (req, res)=>{
  //add user ID into things
  req.body.idForUser = req.session.currentUser._id
    Nothings.create(req.body, (err, createdThings)=>{
      console.log(createdThings);
        res.redirect('/nomain');
      });
  });

  // delete to do
app.delete('/main/:id', (req, res)=>{
    Things.findOneAndRemove({_id: req.params.id}, (err, foundArticle)=>{
      res.redirect( '/main' );
        });
    });

    // Update : PUT    '/nomain/:id'
  app.put( '/nomain/:id' , ( req , res ) => {
      Nothings.findByIdAndUpdate( req.params.id, req.body , { new : true }, ( err , nothings ) => {
        if ( err ) { console.log( err ); }
        res.redirect ( '/nomain' );
      });
    });

  // delete not to do
app.delete('/nomain/:id', (req, res)=>{
    Nothings.findOneAndRemove({_id: req.params.id}, (err, foundArticle)=>{
      res.redirect( '/nomain' );
        });
    });




// users controller
const userController = require('./controllers/users_controller.js')
app.use('/users', userController)

// sessions controller
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
