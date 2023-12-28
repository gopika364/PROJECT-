const cartCollection = require('../models/cartSchema');
const categoryCollection = require('../models/catergorySchema');
const productCollection = require('../models/productSchema');
const registercollection = require('../models/registerSchema');
const orderCollection = require('../models/orderSchema');
const couponCollection = require('../models/couponSchema');

const RazorPay = require('razorpay');

const razorpay = new RazorPay({
    key_id: 'rzp_test_1IphvIbZM875io',
    key_secret: 'jEuL9T3e1o2gMRiCqrmROHEf'
  })

//getCheckOut
const getCheckOut = async(req,res) => {
    const user1 = req.session.user;
    const user = await registercollection.findOne({email:user1});
    const cart = await cartCollection.find({userEmail:user1});


    const items = await cartCollection.find({userEmail:user1});

    const grandTotal = await cartCollection.aggregate([
        {
            $match: {
                userEmail: req.session.user
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: '$totalPrice'
                }
            }
        }
    ]);

    const updatedGrandTotal = grandTotal[0].total;

    const coupon = await couponCollection.find();
    
    res.render('user/checkout',{user,items,updatedGrandTotal,cart,coupon});
}

//addAddress

const addAddress = async(req,res) => {
    const address = {
        address1: req.body.address,
        city: req.body.city,
        state: req.body.state,
        postCode: req.body.postcode,
        name: req.body.name,
        mobile: req.body.mobile,
    }
    await registercollection.updateOne(
        { email: req.session.user },
        { $push: { address: address } }
      );
    res.redirect('/checkOut')
}

//COD
const cashOnDelivery = async(req,res) =>{
    const orderData = req.body;
    await orderCollection.insertMany([orderData]);
    await cartCollection.deleteMany({ userEmail: req.session.user });
    return res.status(200).json({message:'success'});
}

//razorPay

const razorPayOrderCreate = async (req,res) => {
    const user1 = req.session.user;
    const user = await registercollection.findOne({email:user1},{name:1,_id:0})

    const totalamount = req.body.totalamount;
    let options = {
        amount : totalamount*100,
        currency : 'INR',
    };

    razorpay.orders.create(options, function(err,order){
      res.json({order,user})
    })
}

const razorPaySuccess = async(req,res) =>{
    const orderData = JSON.parse(req.query.data); 
    await orderCollection.insertMany([orderData]);
    await cartCollection.deleteMany({ userEmail: req.session.user });
    res.redirect('/orderConfirmed')
}

module.exports = { getCheckOut,addAddress,cashOnDelivery,razorPayOrderCreate,razorPaySuccess};