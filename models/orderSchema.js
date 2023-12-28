const mongoose = require('../database/dbConnect');

const orderSchema = new mongoose.Schema({
    orderItems: [
    {
      productId: {
        type: String,
      },
      productName: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      price: {
        type: Number,
      },
      totalPrice: {
        type: Number,
      },
      image: {
        type: String,
      },
    }
  ],
  paymentMethod: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending'
  },
  userEmail: {
    type: String,
  },
  address:{
    type:String
  },
  date: {
    type: Date,
    default: Date.now
},
});

const orderCollection = new mongoose.model('Order', orderSchema);

module.exports = orderCollection;
