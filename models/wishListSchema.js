const mongoose = require('../database/dbConnect');


const wishlistSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const wishListCollection = new mongoose.model('wishList',wishlistSchema)

module.exports = wishListCollection;
