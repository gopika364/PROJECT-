const nodemailer = require('nodemailer');
require('dotenv').config();

//----------------nodemailer--------------------

const config = {
    service :  'Gmail',
    auth :{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
}
const transporter = nodemailer.createTransport(config)
 



//home
const home = (req,res)=>{
    res.render("user/home");
}

//login
const login = (req,res)=>{
    res.render("user/login");
}

//register

const register =async (req,res)=>{    
    res.render("user/register");
}

//otp
const otp = (req,res)=>{
    res.render("user/otp")
}

//forgotPassword
const forgotPassword = (req,res)=>{
    res.render("user/forgotPassword");
}

const postOtp = (req,res)=>{
    res.render("user/otp");
}





module.exports = {
    login,home,register,otp,forgotPassword,postOtp
}