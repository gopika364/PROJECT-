const couponCollection = require('../models/couponSchema')


const listCoupon = async (req,res) => {
    const coupon = await couponCollection.find();
    res.render('admin/listCoupon',{coupon});
}


// getAddCoupon
const getAddCoupon = async (req, res) => {
    const message = req.session.message;
    req.session.message = null;
    res.render('admin/addCoupon', { message });
};

// postAddCoupon
const postAddCoupon = async (req,res) => {

    const coupon = await couponCollection.findOne({code:req.body.code});
    if(coupon != null){

        req.session.message={
            message: 'Coupon Already Exist',
            type: 'danger'
        }        
        res.redirect('/admin/addCoupon');
    }else{
    const data = {
        code: req.body.code,
        discount: req.body.discount,
        minValue: req.body.minValue,
        expiryDate: req.body.expiryDate,
        description: req.body.description
    }
    await couponCollection.insertMany([data]);

    res.redirect('/admin/listCoupon');
}
}


//editCoupon 

const editCoupon = async (req,res) => {
    const id = req.params.id;
    const message = req.session.message;
    const coupon = await couponCollection.findOne({ _id: id })
    res.render('admin/editCoupon',{coupon,message});
}

//updateCoupon
 const updateCoupon = async(req,res) =>{
    const id = req.params.id;
    const coupon = await couponCollection.findOne({code:req.body.code});
    if(coupon != null){

        req.session.message={
            message: 'Coupon Already Exist',
            type: 'danger'
        }        
        res.redirect(`/admin/editCoupon/${id}`);
    }else{
    const data = {
        code: req.body.code,
        discount: req.body.discount,
        minValue: req.body.minValue,
        expiryDate: req.body.expiryDate,
        description: req.body.description
    }

    await couponCollection.findOneAndUpdate({_id:id},{$set:data});
    res.redirect('/admin/listCoupon');
 }
}

// deleteCoupon 
const deleteCoupon = async (req, res) => {
    const id = req.params.id;

        await couponCollection.deleteOne({ _id: id });
        res.redirect('/admin/listCoupon');

};




  
  

module.exports = { getAddCoupon,postAddCoupon,listCoupon,editCoupon,deleteCoupon,updateCoupon};