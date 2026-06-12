const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

module.exports.createReview = async (req, res) => {
  //wrapAsync is used to catch the error thrown by the async function and pass it to the error handling middleware, so that we can handle the error in a centralized way, instead of having try-catch blocks in every route handler
  //error faced in this like after router is done id was undefined, so we have to merge the params of the parent route with the child route, so that we can access the id of the listing in this route, for that we have to use the mergeParams option in the router
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review); //req.body.review is the review data sent from the form in the show.ejs file, we have to use review because we have to send the data in the form of review[comment] and review[rating] in the show.ejs file, so that we can access the data in the req.body.review object in this route
  newReview.author = req.user._id; //set the author of the review to the current logged in user, so that we can display the username of the author in the show.ejs file, and also we can check if the current logged in user is the author of the review or not, so that we can show the delete button for the review in the show.ejs file
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash('success', 'Successfully added a new review!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { listingId, reviewId } = req.params;

  await Listing.findByIdAndUpdate(
    listingId,
    //pull operator is used to remove the reviewId from the reviews array of the listing
    {
      $pull: { reviews: reviewId }, //reviews is the name of the array in the listing schema, reviewId is the id of the review to be removed
    },
  );
  //delete the review document from the reviews collection
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/listings/${listingId}`);
};
