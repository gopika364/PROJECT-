const registercollection = require('../models/registerSchema');
const cartCollection = require('../models/cartSchema');
const { register } = require('./userController');


const wallet = async(req,res) => {
    const user1 = req.session.user;
    const user = await registercollection.findOne({email:user1});

    const cart = await cartCollection.find({userEmail:user1});

    res.render('user/wallet',{user,cart});

}

module.exports = {
    wallet
};