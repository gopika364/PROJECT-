const cartCollection = require('../models/cartSchema');


const registercollection = require('../models/registerSchema');

const orderConfirmed = async(req,res) => {
    const user1 = req.session.user;
    const user = await registercollection.findOne({email:user1});
    const cart = await cartCollection.find({userEmail:user1});

    res.render('user/orderConfirmed',{user,cart});
}

module.exports = {orderConfirmed};