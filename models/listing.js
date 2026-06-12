const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
    min: 0,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    // _id is the field in the reviews collection, $in operator is used to check if the review id is present in the reviews array of the listing, if it is present then it will be deleted from the reviews collection
    // its say delete all reviews whose _id is in the listing.reviews array
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
