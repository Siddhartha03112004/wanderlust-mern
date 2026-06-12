const express = require('express');
const router = express.Router({ mergeParams: true }); //mergeParams is used to merge the params of the parent ->
//  -> route with the child route, so that we can access the id of the listing in the review.js routes
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { validateReview } = require('../middleware.js');
const { isLoggedIn } = require('../middleware.js');
const { isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');
// reviews

//Post route for creating a new review for a listing

router.post(
  '/',
  isLoggedIn, //middleware to check if the user is logged in or not, if not then redirect to the login page
  validateReview, //middleware to validate the review data using Joi, if the data is invalid then throw an error
  wrapAsync(reviewController.createReview), //controller function to create a new review for a listing, we have to use wrapAsync to catch the error thrown by the async function and pass it to the error handling middleware, so that we can handle the error in a centralized way, instead of having try-catch blocks in every route handler
);

//delete route for deleting a review
router.delete(
  '/:reviewId',
  isLoggedIn, //middleware to check if the user is logged in or not, if not then redirect to the login page
  isReviewAuthor, //middleware to check if the current logged in user is the author of the review or not, if not then redirect to the listing show page
  wrapAsync(reviewController.destroyReview), //controller function to delete a review, we have to use wrapAsync to catch the error thrown by the async function and pass it to the error handling middleware, so that we can handle the error in a centralized way, instead of having try-catch blocks in every route handler
);

module.exports = router;
 