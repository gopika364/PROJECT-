const registercollection = require('../models/registerSchema');
const bcrypt = require('bcrypt');
const { register } = require('./userController');
const cartCollection = require('../models/cartSchema');


//getuserProfile

const userprofile = async(req,res) => {
    const user1 = req.session.user;
    const cart = await cartCollection.find({userEmail:user1});
    const user = await registercollection.findOne({email:user1})
    res.render('user/userprofile',{user,cart});
}

//userAddAddress

const userAddAddress = async (req,res) => {
    const user1 = req.session.user;
    const cart = await cartCollection.find({userEmail:user1});

    const user = await registercollection.findOne({email:user1});
    res.render('user/addAddress',{user,cart});
}

//addAddress

const postUserAddAddress = async(req,res) => {
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
    res.redirect('/userAddAddress')
}

//userDeleteAddress

const userDeleteAddress = async(req,res) => {
    try {

        const id = req.params.id;
        const user = req.session.user;
    
        await registercollection.updateOne(
          { email: user },
          { $pull: { address: { _id: id } } }
        )
        res.redirect('/userAddAddress')
      }
      catch (error) {
        console.error(error);
      }
}

//changePassword
const changePassword = async(req,res) => {
  const user1 = req.session.user;
  const message = req.session.message;
  req.session.message = null;
    const user = await registercollection.findOne({email:user1});
    const cart = await cartCollection.find({userEmail:user1});

  res.render('user/changePassword',{user,message,cart});
}

//postChangePassword
const postChangePassword = async(req,res) => {
  const {password1,password2} = req.body;
  const check = await registercollection.findOne({email:req.session.user});
  const storedHash = check.password;
  bcrypt.compare(password1, storedHash, async(err, result) => {
    if (result == false) {
        req.session.message = {
            message: 'Invalid Password',
            type: 'danger'
        }
        res.redirect('/changePassword');
    }

    else{
      const hashedPassword = await bcrypt.hash(password2, 10);
      await registercollection.findOneAndUpdate({ email: req.session.user }, { $set: { password: hashedPassword } });
      req.session.message = {
        message: 'Password Updated',
        type: 'success'
    }
      res.redirect('/changePassword');
    }
    

  })
}

module.exports = {userprofile,userAddAddress,postUserAddAddress,userDeleteAddress,changePassword,postChangePassword};