const User = require('../models/user.js');

module.exports.renderSignupForm = (req, res) => {
  res.render('users/signup.ejs');
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password); // User.register() is a method provided by passport-local-mongoose, it will register the user in the database, and also hash the password and store it in the database
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      // login method is provided by passport, it will log the user in by creating a session, it takes a callback function that will be called after the user is logged in, if there is an error during login, it will be passed to the callback function
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome to Wanderlust!'); // set a flash message, it will be displayed in the next request, we can access it in the templates using res.locals.success
      res.redirect('/listings'); // redirect to the listings page after successful signup
    });
  } catch (e) {
    req.flash('error', e.message); // set a flash message, it will be displayed in the next request, we can access it in the templates using res.locals.error
    res.redirect('/signup'); // redirect to the signup page if there is an error
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login.ejs');
};

module.exports.login = async (req, res) => {
  req.flash('success', 'Welcome back!');
  let redirectUrl = res.locals.redirectUrl || '/listings'; // get the url that the user was trying to access before being redirected to the login page, which is stored in res.locals.redirectUrl by the saveRedirectUrl middleware, if there is no url stored in res.locals.redirectUrl, it will redirect to the listings page
  res.redirect(redirectUrl); // redirect to the url that the user was trying to access before being redirected to the login page, or redirect to the listings page if there is no url stored in res.locals.redirectUrl
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    // logout method is provided by passport, it will log the user out by destroying the session, it takes a callback function that will be called after the user is logged out, if there is an error during logout, it will be passed to the callback function
    // callback function is required for logout method in passport 0.6.0 and above, it will be called after the user is logged out, if there is an error during logout, it will be passed to the callback function
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged you out!');
    res.redirect('/listings');
  });
};
