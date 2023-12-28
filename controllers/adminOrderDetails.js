const orderCollection = require('../models/orderSchema');
const registercollection = require('../models/registerSchema');
const returnCollection = require('../models/returnSchema');

//getOrderDetails
const OrderDetails = async (req,res) => {
    const order = await orderCollection.find();
    res.render('admin/orderDetails',{order});
}

//editOrders

const editOrders = async (req,res) => {
    const {orderId, newStatus} = req.body;
    res.redirect('/admin/editOrders');

    if(!orderId || !newStatus) {
        return res.status(400).json({ success: false, error: 'Invalid request data' });
    }

    await orderCollection.updateOne({ _id: orderId }, { $set: { status: newStatus } });
    res.json({ success: true });
}

const orderStatus = async(req,res) => {
    const id = req.params.id;
    const status = req.body.status;

    await orderCollection.findOneAndUpdate({_id : id},{$set:{status:status}});
    res.redirect("/admin/orderDetails")
}

//retunrList

const returnList = async(req,res) => {
    const returnOrders = await returnCollection.find();
    res.render('admin/returnList',{returnOrders});
}

//return

const returnItem = async(req,res) => {
    const id = req.params.id;
    const status = 'Return request Pending'

    const data = await orderCollection.findOne({_id:id});

    await returnCollection.insertMany([data]);

    await orderCollection.findByIdAndUpdate({_id:id},{$set:{status:status}});

    const userEmail = req.session.user;
    const user = await registercollection.findOne({email: userEmail});

    if(user && data.totalPrice) {
        user.WalletBalance += data.totalPrice;
        await user.save();
    }

    res.redirect('/orderDetails');
}

//returnStatus

const returnStatus = async(req,res) => {
    const id = req.params.id;
    const status = req.body.status;
    await orderCollection.findOneAndUpdate({_id:id},{$set:{status:status}});
    await returnCollection.findOneAndDelete({_id:id});

    res.redirect('/admin/returnList');
}


module.exports = { OrderDetails,editOrders,orderStatus,returnList,returnItem,returnStatus};