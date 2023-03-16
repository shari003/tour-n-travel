require("dotenv").config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const logger = require("morgan");
const cors = require("cors");
const flash = require('connect-flash');
const session = require('express-session');

const methodOverride = require("method-override");


const PORT = process.env.PORT ?? 3000;

const app = express();

// Passport Config (local)
require('./config/passport')(passport);

// Passport Config (Google OAuth 2.0)
// require("./config/passport-oauth-google")(passport);

// mongoose
//   .connect(
//     process.env.MONGO_URI,
//     { useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false}
//   )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

// EJS
app.use(logger("dev"));
app.use(express.static("public"));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(cors());

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Method Overriding
app.use(methodOverride("_method"));

// Routes
// app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// Home
app.use('/home', require('./routes/home.routes'));

// Book
app.use('/book', require('./routes/book.routes'));

// Packages
app.use('/packages', require('./routes/packages.routes.js'));

// Services
app.use('/services', require('./routes/services.routes.js'));

// Gallery
app.use('/gallery', require('./routes/gallery.routes.js'));

// Review
app.use('/review', require('./routes/review.routes.js'));

// Contact
app.use('/contact', require('./routes/contact.routes.js'));


app.use('*', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Tour & Travels",
        data: "Welcome to Tour & Travels"
    });
});

// Connect to MongoDB
const connectDB = require("./config/db.config");

connectDB()
  .then(() => {
    console.log("CONNECTED TO DATABASE!");

    app.listen(PORT, () => {
      console.log(`Server Started at PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    console.log("Not Connected to database");
  });

  //Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting Down Server due to Uncaught Exception");
  process.exit(1);
});

//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting Down Server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});

// app.listen(PORT, console.log(`Server running on  ${PORT}`));
