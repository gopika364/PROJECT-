const registercollection = require('../models/registerSchema');
const orderCollection = require('../models/orderSchema');
const cartCollection = require('../models/cartSchema');

const { register } = require('./userController');

const ITEMS_PER_PAGE = 2; // Adjust this based on your preference


const orderDetails = async(req,res) => {
    const user1 = req.session.user;
    const user = await registercollection.findOne({email:user1});
    const page = parseInt(req.query.page) || 1;

    try {
        const { docs, totalDocs, totalPages } = await orderCollection.paginate(
            { userEmail: user1 },
            { page, limit: ITEMS_PER_PAGE, sort: { createdAt: -1 } }
        );

    const orders = await orderCollection.find({ userEmail: user1 });
    const cart = await cartCollection.find({userEmail:user1});

    
    res.render('user/orderDetails', { user, orders: docs, cart, totalPages,totalDocs, currentPage: page });
}
catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
}
};

//cancelOrder

const cancelOrder = async(req,res) => {
    const id = req.params.id;
    const status = 'cancelled'

    const order = await orderCollection.findOne({_id:id})

    const totalPriceSum = order.grandTotal;

    if(order.paymentMethod === 'Online Payment') {

        const data = await registercollection.findOne({email:req.session.user});
        const price = data.walletBalance;

        const newPrice = price + totalPriceSum;
        await registercollection.findOneAndUpdate({email:req.session.user},{$set:{walletBalance:newPrice}});

        const orderId = order._id;
        const refund = {
            price : totalPriceSum,
            orderId : orderId,
            status : 'refund'
        }
        await registercollection.findOneAndUpdate(
            { email: req.session.user },
            { $push: { refund: refund } },
            { new: true } 
        )

    }
    
    await orderCollection.findOneAndUpdate({_id:id},{$set:{status:status}});
    res.redirect('/orderDetails')
}



module.exports = {orderDetails,cancelOrder};