const registercollection = require('../models/registerSchema');
const orderCollection = require('../models/orderSchema');
const cartCollection = require('../models/cartSchema');

const { register } = require('./userController');



const orderDetails = async(req,res) => {
    const user1 = req.session.user;
    const user = await registercollection.findOne({email:user1});
    const orders = await orderCollection.find({ userEmail: user1 });
    const cart = await cartCollection.find({userEmail:user1});

    
    res.render('user/orderDetails',{user,orders,cart});
}

//cancelOrder

const cancelOrder = async(req,res) => {
    const id = req.params.id;
    const status = 'cancelled'

    const order = await orderCollection.findOne({_id:id})

    const totalPriceSum = order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    if(order.paymentMethod == 'Online Payment') {

        const data = await registercollection.findOne({email:req.session.user});
        const price = data.walletBalance;

        const newPrice = price + totalPriceSum;
        await registercollection.findOneAndUpdate({email:req.session.user},{$set:{walletBalance:newPrice}});

    }
    
    await orderCollection.findOneAndUpdate({_id:id},{$set:{status:status}});
    res.redirect('/orderDetails')
}



module.exports = {orderDetails,cancelOrder};