const userRegister = require('../models/registerSchema');
const bcrypt = require('bcrypt');
require('dotenv').config;
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const generateOTP = require('generate-otp');
const tempregister = require('../models/temporaryregister');
const validationResult = require('express-validator');
const userList = require('../models/userListSchema');
const productCollection = require('../models/productSchema');
const registercollection = require('../models/registerSchema');
const cartCollection = require('../models/cartSchema');
const categoryCollection = require('../models/catergorySchema');




//...............logout......
const logout = (req,res)=>{
    req.session.user = null;
    req.session.message = {
        message : " successfully logout",
        type : "success",
    }
    res.redirect('/')
}



//shop
const shop = async (req,res) => {
    const user = req.session.user;
    const category = await categoryCollection.find();
    const cart = await cartCollection.find({userEmail:user});
    const products = await productCollection.find();



    res.render('user/shop',{user,cart,products,category});
}

//shopCategory

const shopCategory = async (req,res) => {
    const user = req.session.user;
    const categoryName = req.params.categoryName;
    const category = await categoryCollection.find();
    const cart = await cartCollection.find({userEmail:user});
    const products = await productCollection.find({category:categoryName});

    res.render('user/shop',{user,cart,products,category});
}



//nodemailer
const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user:process.env.EMAIL,
          pass:process.env.PASS,
        },
      });



//gethome
const gethome = async(req,res)=>{
    const user1 = req.session.user;
    const cart = await cartCollection.find({userEmail:user1});
    const message = req.session.message;
    req.session.message = null;

    const user = await registercollection.findOne({email:user1});
    if(req.session.user){
        if(user.isBlock == true){
            res.redirect('/logout');
        }
    }
    const products = await productCollection.find();
    const recentlyAdded = await productCollection.find().sort({ _id: -1 }).limit(5);
   
    res.render('user/home',{user,products,recentlyAdded,message,cart});
}



//register

const getregister = async(req,res)=>{
    const user = req.session.user;
    const message = req.session.message;
    const cart = await cartCollection.find({userEmail:user});

    req.session.message = null;
    
    res.render("user/register",{user,message,cart});

}





//postregister

const register =asyncHandler(async (req, res) => {
     const { name, email, password} = req.body;



    //check user exists
    const userExists = await userRegister.findOne({email});
    if (userExists) {
        req.session.message={
            message: 'User Already Exist',
            type: 'danger'
        }
        res.redirect('/register');
        return
    }



    // Password Hashing 
    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password,salt)

    
    // create User  and Store Hashed Password
    const user = {
        name,
        email,
        password:hashedpassword,
    };

    await tempregister.insertMany([user]);

    setTimeout(async () =>{
        await tempregister.findOneAndDelete({ email: email });
    },18000000);

    // Generate and Store OTP
    const Otp = generateOTP.generate(4,{digits:true,alphabets:false,specialChars:false});
    await tempregister.findOneAndUpdate({ email: email }, { otp: Otp });

    const expirationTime = 1 * 60 * 1000; // 1 minute in milliseconds

    setTimeout(async () => {
        // Remove the OTP from the document after 1 minute
        await tempregister.updateOne({email:email}, { $unset: { otp: 1 } });
      }, expirationTime);

    // Send Email
    const mailOptions = {
        from:process.env.EMAIL,
        to:email,
        subject:'Verify Your OTP Code - Otp will expire in 1 minute ',
        text:`Your OTP code is: ${Otp}`,
    };

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.error('Email sent failed:' , error);
            return res.status(500).json({error: 'Failed to send verification email.'});
        }else{
            console.log('Email Send successfully:', info.response);
        }
    });
    req.session.registerEmail = email; 
    req.session.successMessage = 'Registration successful. Check your email for OTP verification.';

    res.redirect("/otp")
});





//getotp
const getotp = (req,res) => {
    const email = req.session.registerEmail;
    const message = req.session.message;
    req.session.message = null;
    res.render("user/otp",{email,message});
}




//postotp
const otp = asyncHandler(async(req,res) => {
    const email = req.params.email
    const otp = req.body.otp;
    const data = await tempregister.findOne({email:email});
    const sendOtp = data.otp;
    const userData = {
        name:data.name,
        email:data.email,
        password:data.password
    }
    if(otp == sendOtp){
        await userRegister.insertMany([userData])
        await tempregister.findOneAndDelete({ email: email });
        req.session.message = {
            message: "User Registred Successfully",
            type: "success",
        }
        res.redirect('/login')
    
    }else{
        req.session.message = {
            message : " Invalid Otp",
            type : "danger",
        }
        res.redirect('/otp')
    }
 
});
   





//login

const getlogin = async(req,res) => {
    const user = req.session.user;
    const cart = await cartCollection.find({userEmail:user});

    if(req.session.user){
        res.redirect('/')
    }else{
        const message = req.session.message;
        req.session.message = null
        res.render("user/login",{user,message,cart});
    }
    
 
}

//postlogin
const login =asyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    //Find the user in db by email only 
    const userFound = await userRegister.findOne({
        email,
    });
   if(userFound && await bcrypt.compare(password,userFound?.password)){ //to compare the hashpassword and the plain password that is given by the user
      if(userFound.isBlock === false){
        req.session.user = email
        req.session.message={
            message: 'user sussessfully logged In',
            type: 'success',
        }
        res.redirect('/');
      }else if(userFound.isBlock === true){
        req.session.message={
            message: 'user is blocked',
            type: 'danger'
        }
        res.redirect('/login');
      }
   
   }else{
    req.session.message={
        message: 'Invalid Credentials',
        type: 'danger'
    }
    res.redirect('/login');
   }
});


//getforgotPassword
const getforgotPassword = (req,res)=>{
    res.render('user/forgotPassword');
}



const getforgotOtp = (req,res)=>{
    const email = req.session.forgetEmail
    res.render('user/forgotOtp',{email});
}



//forgotPassword
const forgotPassword =asyncHandler(async(req,res)=>{
    try{
        const email = req.body.email ;
        req.session.forgetEmail = email;
    
        const otpuserExists = await userRegister.findOne({email});
        if(otpuserExists){
            const Otp = generateOTP.generate(4,{digits:true,alphabets:false,specialChars:false});
            req.session.otp=Otp
        
            const mailOptions ={
                from:process.env.EMAIL,
                to:email,
                subject:"Your OTP",
                text:`Your OTP is ${Otp}`
            };
        
            transporter.sendMail(mailOptions,function(error,info) {
                if(error){
                    console.log(error);
                }else{
                    console.log("email send");
                }
                
            });
            res.redirect('/forgotOtp');
        }
        else{
            console.log('failed to send otp');
            res.redirect('/forgetPassword');
        }
    }catch(error){
        console.error(error);
    }

   
});

const newresetPassword = (req,res) => {
    res.render('user/resetPassword');
}





//postforgotOtp

const postforgotOtp = asyncHandler(async(req,res) => {
    const email = req.session.forgetEmail;
    const otp = req.body.otpValue;
    const sendOtp = req.session.otp;

   

    if(otp == sendOtp){

        return res.json({message:'success'});
    
    }else{
        return res.json({message:'errorotp'});
    }
 
});




//resendOtp1

const resendOtp1 = async(req,res)=> {
    const Otp = generateOTP.generate(4,{digits:true,alphabets:false,specialChars:false});
    req.session.otp = null
    req.session.otp = Otp
    const email = req.session.forgetEmail
    

            const mailOptions ={
                from:process.env.EMAIL,
                to:email,
                subject:"Your OTP",
                text:`Your OTP is ${Otp}`
            };
        
            transporter.sendMail(mailOptions,function(error,info) {
                if(error){
                    console.log(error);
                }else{
                    console.log("email send");
                }
                
            });
            console.log('qwer');
            res.redirect('/forgotOtp');
}





//resetPassword

const resetPassword = (req,res) => {
    res.render('user/resetPassword');
}




//postResetPass

const postResetPass = asyncHandler(async (req, res) => {
    try {
        const email = req.session.forgetEmail;
        const newPass = req.body.newPassword;
        const conPass = req.body.confirmPassword;

        if (conPass === newPass) {
            const hashedPassword = await bcrypt.hash(newPass, 10);

            await userRegister.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
            const successMessage = 'Password succesfully changed';
            req.session.successMessage = successMessage;
            // const user= req.session.user;
            req.session.forgetEmail = null;
            res.redirect('/login');
        } else {
            res.redirect('/reset');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('server error')
    }
});




//resendOtp
    const resendOtp = async(req,res)=> {
    const Otp = generateOTP.generate(4,{digits:true,alphabets:false,specialChars:false});
    req.session.otp = null
    req.session.otp = Otp
    const email = req.session.registerEmail
    await tempregister.findOneAndUpdate({ email: email }, { otp: Otp });
    
    const expirationTime = 1 * 60 * 1000; 

    setTimeout(async () => {

        // Remove the OTP from the document after 1 minute
        
        await tempregister.updateOne({email:email}, { $unset: { otp: 1 } });
      }, expirationTime);

            const mailOptions ={
                from:process.env.EMAIL,
                to:email,
                subject:"Your OTP",
                text:`Your OTP is ${Otp}`
            };
        
            transporter.sendMail(mailOptions,function(error,info) {
                if(error){
                    console.log(error);
                }else{
                    console.log("email send");
                }
                
            });
            res.redirect('/otp');
}



//product details

const productdetails = async(req,res) => {
    const id = req.params.id;
    const productData = await productCollection.findOne({_id:id});
    const user1 = req.session.user;
    const user = await registercollection.findOne({email:user1});
    const cart = await cartCollection.find({userEmail:user});


    res.render('user/productDetail',{user,productData,cart});
}





module.exports = {
    shop,shopCategory,gethome,login,getlogin,register,getregister,getotp,otp,forgotPassword,logout,resetPassword,getforgotPassword,postforgotOtp,postResetPass,resendOtp,
    getforgotOtp,productdetails,newresetPassword,resendOtp1

}