const registercollection = require('../models/registerSchema');
const cartCollection = require('../models/cartSchema')


//editUser

const editUser = async(req,res) => {
    const user1 = req.session.user;
    const cart = await cartCollection.find({userEmail:user1});

    const user = await registercollection.findOne({email:user1})
    res.render('user/editUser',{user,cart});
}


//UpdateUser

const updateUser = async (req, res) => {
    const user1 = req.session.user;
    const { name, email } = req.body;
    console.log(req.body.name);
    try {
        await registercollection.findOneAndUpdate({ email: user1 }, { name });
        res.redirect('/userprofile'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user details');
    }
}



module.exports = {editUser, updateUser};