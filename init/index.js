const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '6a1ae4771578993a32380d44',
  })); // add the owner field to each listing object, and set it to the id of the user who is the owner of the listing
  await Listing.insertMany(initData.data);
  console.log('data was initialized');
};

initDB();
