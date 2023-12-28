const cartCollection = require('../models/cartSchema');


const registercollection = require('../models/registerSchema');

const orderConfirmed = async(req,res) => {
    const user = req.user;
    const cart = await cartCollection.find({userEmail:user});

    res.render('user/orderConfirmed',{user,cart});
}

module.exports = {orderConfirmed};