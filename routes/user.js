const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const usersController = require('../controllers/users.js');

router
  .route('/signup') // we can chain the get and post methods for the same route using the route method of the router, it will make our code cleaner and more organized
  .get(usersController.renderSignupForm)
  .post(wrapAsync(usersController.signup));

// router.get('/signup', usersController.renderSignupForm);

// router.post('/signup', wrapAsync(usersController.signup));

router
  .route('/login')
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    usersController.login,
  );

// router.get('/login', usersController.renderLoginForm);

// router.post(
//   '/login',
//   saveRedirectUrl, // saveRedirectUrl is a middleware that we have defined in middleware.js, it will save the url that the user was trying to access before being redirected to the login page, so that we can redirect the user back to that url after successful login
//   passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true,
//   }), // use the authenticate method of passport, it will authenticate the user using the local strategy defined in app.js, if authentication fails, it will redirect to the login page and set a flash message with the error, if authentication is successful, it will call the next middleware, which is the wrapAsync function that we have defined, it will help us to handle the errors in the async function

// wrapAsync(async (req, res) => {
//   try {
//     req.flash('success', 'Welcome back!'); // set a flash message, it will be displayed in the next request, we can access it in the templates using res.locals.success
//     res.redirect('/listings'); // redirect to the listings page after successful login
//   } catch (e) {
//     req.flash('error', e.message); // set a flash message, it will be displayed in the next request, we can access it in the templates using res.locals.error
//     res.redirect('/login'); // redirect to the login page if there is an error
//   }
// }),

//   usersController.login,
// );

router.get('/logout', usersController.logout);

module.exports = router;
