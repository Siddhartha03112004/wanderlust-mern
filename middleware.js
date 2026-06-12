const Listing = require('./models/listing');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //redirectUrl is the url that the user was trying to access before being redirected to the login page, we will store it in the session, so that we can redirect the user back to that url after successful login
    req.session.redirectUrl = req.originalUrl; //originalUrl is the url that the user was trying to access before being redirected to the login page, we will store it in the session, so that we can redirect the user back to that url after successful login
    req.flash('error', 'You must be signed in to access that page!');
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    //if there is a redirectUrl in the session, then we will make it available in the templates, so that we can use it in the login form to redirect the user back to that url after successful login
    res.locals.redirectUrl = req.session.redirectUrl; // make the redirectUrl available in the templates, so that we can use it in the login form to redirect the user back to that url after successful login
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash('error', 'You are not the owner of this listing!');
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//middleware for validating the listing data
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body); //{ error} mtlb error nikalo bs jo listingSchema.validate(req.body) se return hoga, error ko variable me store krlo
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(','); //array of error messages to a single string
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// middleware for validating the review data
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  //{ error} mtlb error nikalo bs jo listingSchema.validate(req.body) se return hoga, error ko variable me store krlo
  // validate the user's input(req. body) using the reviewSchema, agar error hai to usko variable me store krlo
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(','); //array of error messages to a single string
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash('error', 'You are not the author of this review!');
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// //temp

// module.exports.validateReview = (req, res, next) => {
//   console.log(req.body);

//   let { error } = reviewSchema.validate(req.body);

//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(',');
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };
