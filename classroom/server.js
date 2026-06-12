const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const path = require('path');

const sessionOptions = {
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash('success'); // Pass success messages to the template
  res.locals.errorMsg = req.flash('error'); // Pass error messages to the template
  next();
});

app.get('/register', (req, res) => {
  let { name = 'anonymous' } = req.query;
  req.session.name = name;

  if (name === 'anonymous') {
    req.flash('error', 'You have not provided a name!');
  } else {
    req.flash('success', 'You have registered successfully!');
  }

  res.redirect('/hello');
});

app.get('/hello', (req, res) => {
  res.render('page.ejs', { name: req.session.name });
});

app.get('/test', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
