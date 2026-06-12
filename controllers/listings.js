const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index.ejs', { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // if (!req.isAuthenticated()) {
  //   req.flash('error', 'You must be signed in to create a listing!');
  //   return res.redirect('/listings');
  // }

  res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      //populate the reviews of the listing, so that we can display the reviews in the show page
      path: 'reviews', //populate the reviews of the listing, so that we can display the reviews in the show page
      populate: {
        path: 'author', //populate the author of the review, so that we can display the username of the author in the show page
      },
    })
    .populate('owner'); //populate the owner of the listing, so that we can display the username of the owner in the show page
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/login');
  }
  res.render('listings/show.ejs', { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path; // This is the URL of the uploaded image returned by Cloudinary after a successful upload
  let filename = req.file.filename; // This is the filename of the uploaded image returned by Cloudinary after a successful upload

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //set the owner of the listing to the currently logged in user, req.user is added by passport, it will contain the user object if the user is authenticated, otherwise it will be undefined
  newListing.image = { url, filename }; // Store the image URL and filename in the listing document
  //instance aagyi
  await newListing.save();
  req.flash('success', 'Successfully made a new listing!');
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
  }

  let originalImageUrl = listing.image.url; //`Store the original image URL before rendering the edit form
  originalImageUrl = originalImageUrl.replace('/upload/', '/upload/w_250/'); //Modify the original image URL to include the width parameter for resizing
  res.render('listings/edit.ejs', { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== 'undefined') {
    let url = req.file.path; // This is the URL of the uploaded image returned by Cloudinary after a successful upload
    let filename = req.file.filename; // This is the filename of the uploaded image returned by Cloudinary after a successful upload
    listing.image = { url, filename }; // Update the image URL and filename in the listing document
    await listing.save(); // Save the updated listing document to the database
  }
  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the listing!');
  res.redirect('/listings');
};
