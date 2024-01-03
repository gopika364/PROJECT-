const express = require('express');
const router = express.Router();

const user = require('../controllers/userController');
const userProfile = require('../controllers/userProfileController');
const cart = require('../controllers/cartController');
const checkout = require('../controllers/checkOutController');
const orderConfirmed = require('../controllers/orderConfirmedcontroller');
const editUser = require('../controllers/editUserController');
const orderDetails = require('../controllers/orderDetailsController');
const walletContoller = require('../controllers/walletContoller');
const wishList = require('../controllers/wishListController');
const couponController = require('../controllers/couponController')

const isUserBlocked = require('../middleware/isUserBlocked');




router.get('/',user.gethome);

router.get('/shop',isUserBlocked,user.shop);
router.get('/shopCategory/:categoryName',user.shopCategory);

router.get('/login',user.getlogin);
router.post('/login',user.login);

router.get('/logout',user.logout);

router.get('/register',user.getregister);
router.post('/register',user.register);

router.get('/otp',user.getotp);
router.post('/otp/:email',user.otp);



router.get('/resendOtp',user.resendOtp);
router.get('/resendOtp1',user.resendOtp1);



router.post('/forgotPassword',user.forgotPassword);
router.get('/forgetPassword',user.getforgotPassword);

router.post('/reset',user.postforgotOtp);
router.get('/forgotOtp',user.getforgotOtp);

router.get('/newresetPasswrod',user.newresetPassword);

router.get('/resetPassword',user.resetPassword);
router.post('/postreset',user.postResetPass);

router.get('/productdetails/:id',user.productdetails);

router.get('/userprofile',isUserBlocked,userProfile.userprofile);
router.get('/editUser',isUserBlocked,editUser.editUser);
router.post('/updateUser',isUserBlocked,editUser.updateUser);
router.get('/userAddAddress',isUserBlocked,userProfile.userAddAddress);
router.post('/userAddAddress',isUserBlocked,userProfile.postUserAddAddress);
router.get('/userDeleteAddress/:id',isUserBlocked,userProfile.userDeleteAddress);
router.get('/changePassword',isUserBlocked,userProfile.changePassword);
router.post('/changePassword',isUserBlocked,userProfile.postChangePassword);




router.get('/cart',isUserBlocked,cart.cart);
router.get('/addtoCart/:id',isUserBlocked,cart.addtoCart);
router.post('/removeCart',isUserBlocked,cart.removeCart);
router.post('/updateCartItem',isUserBlocked,cart.updateCartItem);

router.get('/checkOut',checkout.getCheckOut);
router.post('/addAddress',checkout.addAddress);
router.post('/cashOnDelivery',checkout.cashOnDelivery);
router.get('/cancelOrder/:id',orderDetails.cancelOrder);

router.post('/onlinePayment',checkout.razorPayOrderCreate);
router.post('/paymentSuccess',checkout.razorPaySuccess);

router.get('/orderDetails',isUserBlocked,orderDetails.orderDetails);
router.get('/orderConfirmed',isUserBlocked,orderConfirmed.orderConfirmed);

router.get('/wallet',isUserBlocked,walletContoller.wallet);

router.get('/wishList',wishList.wishList);
router.post('/wishlist/add/:id', wishList.addToWishlist);
// router.delete('/wishlist/remove/:productId', wishListController.removeFromWishlist);

router.post('/verifycoupon',couponController.verifycoupon);
router.post('/clearCoupon',couponController.clearCoupon);


//reset
// router.post('/reset',user.postforgotPassword);


module.exports = router;