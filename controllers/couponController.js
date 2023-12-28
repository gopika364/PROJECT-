const couponCollection = require('../models/couponSchema');
const registerCollection = require('../models/registerSchema');

const verifycoupon = async (req, res) => {
    try {
        const couponvalue = req.body.couponvalue
        const grandtotal = req.body.grandTotal
        const total = req.body.total
        const email = req.session.user


        let newtotal1
        let newtotal

        let discount
        let couponid
        let minvalue

        const coupondb = await couponCollection.findOne({ code: couponvalue });

        if (coupondb) {
            discount = coupondb.discount;
            couponid = coupondb._id
            minvalue = coupondb.minvalue
            newtotal1 = (discount / 100) * total
            newtotal = total - newtotal1
        }
        else if (req.session.coupon == req.body.couponvalue) {
            res.status(400).json({ message: 'coupon in input', discount, total });
            return;
        }
        else if (coupondb == null) {
            req.session.coupon = ''
            res.status(400).json({ message: 'invalid coupon', discount, grandtotal });
            return;
        }
        else if (req.session.coupon == req.body.couponvalue) {
            res.status(400).json({ message: 'alredy in input', discount, newtotal });
            return;
        }

        const couponExists = await registerCollection.findOne({
            email: email,
            'usedcoupons.couponid': couponid
        });


        if (couponExists) {
            req.session.coupon = ''
            res.status(400).json({ message: 'invalid coupon', discount, grandtotal });
            return
        }
        else if (grandtotal < minvalue) {
            res.status(400).json({ message: 'minimum 2000', discount, minvalue });
            return
        }
        else {
           

            req.session.coupon = req.body.couponvalue

            console.log(req.session.coupon,req.session.user);

            res.status(200).json({ message: 'coupon matching', discount, couponid, newtotal });
        }

    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//clearCoupon
const clearCoupon = async (req, res) => {
    req.session.coupon = ''
    const couponid = req.body.couponid
    const email = req.session.user
    await registerCollection.updateOne(
        { email: email },
        { $pull: { coupons: { couponid: couponid } } }
    );
    res.status(200).json({ message: 'removed' })
}

module.exports = { verifycoupon,clearCoupon}