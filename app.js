if (process.env.NODE_ENV !== 'production') {
  // this will check if the environment is not production, then it will load the .env file, because in production we will set the environment variables in the hosting platform, so we don't want to load the .env file in production
  require('dotenv').config(); // this will load the .env file and add the variables to process.env, so we can access them in our code using process.env.VARIABLE_NAME
}

// console.log(process.env.SECRET); // this will print the value of SECRET from the .env file, which is thisisasecretkey

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // help in creating templates
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo').default; // this will help us to store the session data in MongoDB, so that even if the server restarts, the session data will not be lost, and also it will help us to scale the application, because if we are storing the session data in memory, then it will be lost when the server restarts, and also it will not work in a clustered environment, because each instance of the server will have its own memory, so if we are storing the session data in memory, then it will not work in a clustered environment, but if we are storing the session data in MongoDB, then it will work in a clustered environment, because all the instances of the server will be able to access the same session data from MongoDB
const flash = require('connect-flash');
const passport = require('passport'); // authentication middleware, it will help us to authenticate the user, and also to store the user in the session
const LocalStrategy = require('passport-local'); // authentication strategy, it will help us to authenticate the user using username and password
const User = require('./models/user.js'); // user model, it will help us to create a user, and also to authenticate the user

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const dns = require('dns'); // this will help us to set the DNS servers, so that we can resolve the domain names to IP addresses, because sometimes the default DNS servers provided by the hosting platform may not be reliable, so we can set our own DNS servers, in this case we are setting Google's DNS servers and Cloudflare's DNS servers, which are reliable and fast
dns.setServers(['8.8.8.8', '1.1.1.1']); // this will set the DNS servers to Google's DNS servers and Cloudflare's DNS servers
// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASDB_URL; // this will get the value of ATLAS_URL from the .env file, which is the connection string for MongoDB Atlas

main()
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  // console.log('DB URL =', dbUrl);
  await mongoose.connect(dbUrl);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const store = MongoStore.create({
  // this will create a new MongoStore instance, and it will connect to the MongoDB database using the connection string provided in dbUrl, and it will store the session data in the database
  mongoUrl: dbUrl, // this will get the value of ATLAS_URL from the .env file, which is the connection string for MongoDB Atlas
  crypto: {
    secret: process.env.SECRET, // this will encrypt the session data in the database, so that even if someone gets access to the database, they will not be able to read the session data, because it will be encrypted
  },
  touchAfter: 24 * 60 * 60, // time period in seconds, after which the session will be updated in the database, even if the session is not modified, this will help us to reduce the number of writes to the database, because if we are updating the session in the database every time the user makes a request, then it will create a lot of writes to the database, and it will also increase the latency of the application, because each write to the database will take some time, but if we are updating the session in the database only after a certain time period, then it will reduce the number of writes to the database, and it will also improve the performance of the application
});

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e);
}); // this will listen for any errors that occur in the MongoStore instance, and it will log the error to the console, so that we can debug the issue

const sessionOptions = {
  store: store, // this will use the MongoStore instance we created above to store the session data in the database
  secret: process.env.SECRET, // this will get the value of SECRET from the .env file, which is the secret key used to sign the session ID cookie, and also to encrypt the session data in the database, so it should be a long and random string, and it should be kept secret, because if someone gets access to the secret key, then they can forge the session ID cookie, and they can also decrypt the session data in the database, so it is important to keep the secret key safe
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //cookie will expire in 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7, //cookie will expire in 7 days
    httpOnly: true, // this will prevent the cookie from being accessed by client-side JavaScript, which can help to prevent cross-site scripting (XSS) attacks, because if the cookie is accessible by client-side JavaScript, then an attacker can inject malicious JavaScript code into the website, and that code can access the cookie and steal the session data, but if we set httpOnly to true, then the cookie will not be accessible by client-side JavaScript, so even if an attacker injects malicious JavaScript code into the website, they will not be able to access the cookie and steal the session data
  },
};

// app.get('/', (req, res) => {
//   res.send('Hi, I am root');
// });

app.use(session(sessionOptions)); // use the session middleware, it will add a session object to the request object, so we can access it in the routes, and it will also set a cookie in the browser with the session id, so that we can identify the user in the next request
app.use(flash());

app.use(passport.initialize()); // initialize passport, it will add some methods to the request object, so we can use them in the routes
app.use(passport.session()); // use the session middleware of passport, it will help us to store the user in the session, and also to retrieve the user from the session
passport.use(new LocalStrategy(User.authenticate())); // use the local strategy of passport, it will help us to authenticate the user using username and password, User.authenticate() is a method provided by passport-local-mongoose, it will authenticate the user using the username and password stored in the database

passport.serializeUser(User.serializeUser()); // serialize the user, it will help us to store the user in the session, User.serializeUser() is a method provided by passport-local-mongoose, it will serialize the user using the id of the user
passport.deserializeUser(User.deserializeUser()); // deserialize the user, it will help us to retrieve the user from the session, User.deserializeUser() is a method provided by passport-local-mongoose, it will deserialize the user using the id stored in the session

app.use((req, res, next) => {
  res.locals.success = req.flash('success'); //res.locals is an object that is available in all the templates, so we can access success in all the templates
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user; //req.user is added by passport, it will contain the user object if the user is authenticated, otherwise it will be undefined, so we can access currUser in all the templates to check if the user is authenticated or not
  next();
});

// app.get('/demoUser', async (req, res) => {
//   let fakeUser = new User({
//     username: 'demoUser',
//     email: 'student@gmail.com',
//   });

//   let registeredUser = await User.register(fakeUser, 'helloworld'); // User.register() is a method provided by passport-local-mongoose, it will register the user in the database, and also hash the password and store it in the database

//   res.send(registeredUser);
// });

app.use('/listings', listingRouter); //use the routes defined in listings.js
app.use('/listings/:id/reviews', reviewRouter); //use the routes defined in review.js, mtlb jab bhi /listings/:id/reviews pe request aayegi to review.js ke routes use honge
//parent route is /listings/:id/reviews, child route is /listings/:id/reviews/:reviewId, so we have to merge the params of the parent route with the child route, so that we can access the id of the listing in the review.js routes, for that we have to use the mergeParams option in the router in review.js
app.use('/', userRouter); //use the routes defined in user.js

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.use((req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('error.ejs', { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log('server is listening to port 8080');
});
