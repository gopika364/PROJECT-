const mongoose  = require('../database/dbConnect')


const couponSchema=new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    minValue: {
        type: Number,
        require:true
    },
    expiryDate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const couponCollection = new mongoose.model('coupon',couponSchema)

module.exports=  couponCollection ;