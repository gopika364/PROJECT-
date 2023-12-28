const wishListCollection = require('../models/wishListSchema');
const cartCollection = require('../models/cartSchema')

// wishList
const wishList = async (req, res) => {
  try {
    const user = req.session.user;
    const user1 = req.session.user;

    const cart = await cartCollection.find({userEmail:user1});


    const wishListItems = await wishListCollection.find({ userEmail: req.session.user });
    res.render('user/wishList', {cart,wishListItems,user});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};


//add

const addToWishlist = async (req, res) => {
    try {
      const { productId, productName, price, image } = req.body;
      const wishlistItem = new wishListCollection({
        userEmail: req.session.user,
        productId,
        productName,
        price,
        image,
      });
      await wishlistItem.save();
      res.json({ success: true, message: 'Item added to wishlist' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

module.exports = {
  wishList,addToWishlist
};
