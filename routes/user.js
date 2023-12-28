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




router.get('/',user.gethome);

router.get('/shop',user.shop);
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

router.get('/userprofile',userProfile.userprofile);
router.get('/editUser',editUser.editUser);
router.post('/updateUser', editUser.updateUser);
router.get('/userAddAddress',userProfile.userAddAddress);
router.post('/userAddAddress',userProfile.postUserAddAddress);
router.get('/userDeleteAddress/:id',userProfile.userDeleteAddress);
router.get('/changePassword',userProfile.changePassword);
router.post('/changePassword',userProfile.postChangePassword);




router.get('/cart',cart.cart);
router.get('/addtoCart/:id',cart.addtoCart);
router.post('/removeCart',cart.removeCart);
router.post('/updateCartItem',cart.updateCartItem);

router.get('/checkOut',checkout.getCheckOut);
router.post('/addAddress',checkout.addAddress);
router.post('/cashOnDelivery',checkout.cashOnDelivery);
router.get('/cancelOrder/:id',orderDetails.cancelOrder);

router.post('/onlinePayment',checkout.razorPayOrderCreate);
router.post('/paymentSuccess',checkout.razorPaySuccess);

router.get('/orderDetails',orderDetails.orderDetails);
router.get('/orderConfirmed',orderConfirmed.orderConfirmed);

router.get('/wallet',walletContoller.wallet);

router.get('/wishList',wishList.wishList);
// router.post('/wishlist/add/:id', wishListController.addToWishlist);
// router.delete('/wishlist/remove/:productId', wishListController.removeFromWishlist);

router.post('/verifycoupon',couponController.verifycoupon);
router.post('/clearCoupon',couponController.clearCoupon);



module.exports = router;