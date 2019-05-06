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
  // res.send('index route')
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  })
})

app.get('/main', (req, res) => {
  User.findOne({_id: req.session.currentUser._id}, (err, user) => {
    Things.find({idForUser: req.session.currentUser._id}, (err, things) => {
      console.log(things);
      res.render('main.ejs', {
        currentUser: user,
        thingz: things

  })
})
})
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

app.delete('/main/:id', (req, res)=>{
    Things.findOneAndRemove({_id: req.params.id}, (err, foundArticle)=>{
      res.redirect( '/main' );
        });
    });


// app.delete ('/main/:id' , ( req , res ) => {
//     // Things.findOneAndRemove({_id: req.params.id}, (error, things) => {
//       User.findOneAndUpdate({_id: req.session.currentUser._id}, { $pull: { todo: { id_: req.params.id } } },  (error, person) =>{
//         console.log(person);
//         res.redirect ( '/main' );
//       });
// });

// app.delete ('/main/:id' , ( req , res ) => {
//   User.findOneAndUpdate({_id: req.session.currentUser._id}, { pull: { todo: { _id: req.params.id } } } );
//   res.redirect ( '/main' );
// });


// db.survey.update(
//   { },
//   { $pull: { results: { score: 8 , item: "B" } } },
//   { multi: true }
// )
//
// { },
//  { $pull: { results: { $elemMatch: { score: 8 , item: "B" } } } },
//  { multi: true }
// )
//
// "results" : [
//     { "item" : "C", "score" : 8, "comment" : "Strongly agree" },
//     { "item" : "B", "score" : 4 }

// users controller
const userController = require('./controllers/users_controller.js')
app.use('/users', userController)

// sessions controller
const sessionsController = require('./controllers/sessions_controller.js')
app.use('/sessions', sessionsController)
