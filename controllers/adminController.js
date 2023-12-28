require('dotenv').config();
const bodyParser = require('body-parser');
const adminloginSchema = require('../models/registerSchema')
const product = require('../models/productSchema');
const userSchemacollection = require('../models/userListSchema');
const registercollection = require('../models/registerSchema');
const asyncHandler = require('express-async-handler');
const categoryCollection = require('../models/catergorySchema');
const productCollection = require('../models/productSchema');
const orderCollection = require('../models/orderSchema');

//home
const home = (req,res)=>{
  const message = req.session.message;
  req.session.message = null;
    res.render("admin/home",{message});
}

//getsignin
const getsignin = (req,res)=>{
  if(req.session.admin ){
    const message = req.session.message;
    req.session.message = null;
    res.redirect('/admin/home');
  }
  const message = req.session.message;
  req.session.message = null;
    res.render("admin/signin",{message});
}

//postsignin
const signin = (req,res)=>{
    const { email: submittedEmail ,password: submittedPassword} = req.body;

    //validation rules
  
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASS;

    if(submittedEmail === adminEmail && submittedPassword === adminPassword)
    {
      req.session.admin = adminEmail;
      req.session.message = {
        message : " login successfully",
        type : "success",
      }
        res.redirect("/admin/home");
    }else {
      req.session.message = {
        message : "Invalid Credentials",
        type : "danger",
      }
        res.status(400).redirect('/admin/signin');
    }
}

//userlist
const userslist = async (req, res) => {
    try {
      // Fetch all users from the database
      const users = await registercollection.find();
  
      res.render('admin/userslist', { users }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }


//block
    const block = async(req,res) => {
    const userId = req.body.userId;
    const user = await registercollection.findOneAndUpdate({_id:userId},{$set:{isBlock:true}})
    res.redirect('/admin/userlist');
  }
//unblock
  const unblock = async(req,res) => {
    const userId = req.body.userId;
    const user = await registercollection.findOneAndUpdate({_id:userId},{$set:{isBlock:false}})
    res.redirect('/admin/userlist');
  }

  //getaddCategory
  const addCategory = async(req,res) => {
    // const exist = req.query.exist;
    const message = req.session.message;
    req.session.message = null;
    res.render('admin/addcategory',{message});
  }



  //postaddCategory
  const postaddCategory = async(req,res) => {
    const originalCategory = req.body.category;

    const data = {
      category: originalCategory.trim().toUpperCase() // Convert to uppercase
  }

  const category = originalCategory.trim().toUpperCase();

    
    // const check = await categoryCollection.findOne({category:req.body.category},{category:1})
    const check = await categoryCollection.findOne({ category:category });
    if(check == null){
      await categoryCollection.insertMany([data])
      req.session.message = {
        message : 'category Added successfully',
        type : 'success',
      }
      res.redirect('/admin/categoryList');
  
    }else if(check.isAvailable == false){
      await categoryCollection.findOneAndUpdate({category:category},{$set:{isAvailable:true}});
      req.session.message = {
        message : 'category Added successfully',
        type : 'success',
      }
      res.redirect('/admin/categoryList');  
    }
    else{
      req.session.message = {
        message : 'category Exist',
        type : 'danger',
      }
      res.redirect('/admin/addcategory');
      
  }
}


  //categoryList

  const categoryList = async(req,res) => {
    const category = await categoryCollection.find();
    const message = req.session.message;
        req.session.message = null; 
    res.render('admin/categoryList',{category,message});
  }

  //editcategory
  const editCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryCollection.findById(categoryId);
        const message = req.session.message;
        req.session.message = null;
        res.render('admin/editCategory', { category ,message});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
  //postEditCayegory
  const postEditCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const originalCategory = req.body.category;
        const category = originalCategory.trim().toUpperCase();
        const check = await categoryCollection.findOne({ category:category });
        
        if(check == null){
          await categoryCollection.findByIdAndUpdate(categoryId, { category: category });
          req.session.message = {
            message : "Category Eddited",
            type : "success",
          }
          res.redirect('/admin/categoryList');
        }else{
        req.session.message = {
          message : "Category Already exist",
          type : "danger",
        }
        res.redirect(`/admin/editCategory/${categoryId}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//deleteCategory

const deletecategory = async (req, res) => {
  const id = req.params.id;
  try {
    
    const category = await categoryCollection.findOne({_id: id});
    const name = category.category;

    await productCollection.updateMany({category:name},{$set:{isAvailable:false}});

    await categoryCollection.updateMany({ _id: id },{$set:{isAvailable:false}},{new:true});
    req.session.message = {
      message : 'Category Deleted',
      type : 'success',
    }
      res.redirect('/admin/categoryList');
  }
  catch (err) {
      console.error('Error :', err);
      res.status(500).json({ error: 'Internal server error' });
  }

}



//..............addProduct....................
   const addProduct = async(req,res)=>{
    const category = await categoryCollection.find();
    const message = req.session.message;
    req.session.message = null;
     res.render('admin/addProduct',{category,message});
}


// // .................postaddProduct...........

const postaddProduct = async (req, res) => {
  try {

      const data = {
        name: req.body.productname,
        stock: req.body.stockquantity,
        price: req.body.price,
        description: req.body.description,
        images: req.files.map(file => file.filename),
        category: req.body.productcategory
      }
      await productCollection.insertMany([data])
      req.session.message = {
        message : 'Product Added',
        type : 'success',
      }
      res.redirect('/admin/addProduct');
  }
  catch (err) {
      console.error('Error :', err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

//productlist
  const productlist = async(req,res)=>{
  const product = await productCollection.find({})
  const message = req.session.message;
    req.session.message = null;
  res.render("admin/productlist",{product,message});
}

//editProduct

  const editProduct = async(req,res) => {
  try {
    const category = await categoryCollection.find();
    const id = req.params.id
    const product = await productCollection.findOne({ _id: id });
    req.session.message = {
      message : 'Product Editted',
      type : 'success',
    }
    res.render('admin/editProduct',{ product,category})
  }
  catch (err) {
      console.error('Error :', err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

//postproductupdate

const postproductupdate = async (req, res) => {
  try {
      const id = req.body.id;
      const files = req.files;

      if (!files || Object.keys(files).length === 0) {
          const data = {
              name: req.body.productname,
              stock: req.body.stockquantity,
              price: req.body.price,
              description: req.body.description,
              category: req.body.productcategory
          }
          await productCollection.updateOne({ _id: id }, { $set: data })
          req.session.message = {
            message : 'Product Updated',
            type : 'success',
          }
          res.redirect('/admin/productlist')
      }
      else{
          const image=req.files.map(file => file.filename)
          const data = {
              name: req.body.productname,
              stock: req.body.stockquantity,
              price: req.body.price,
              description: req.body.description,
              category: req.body.productcategory
          }
          await productCollection.updateOne({ _id: id }, { $set: data })
          await productCollection.findByIdAndUpdate(
              id,
              { $push: { images: { $each: image } } },
              { new: true }
          );
          res.redirect('/admin/productlist')
      }
      
  }
  catch (err) {
      console.error('Error :', err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

//productimgdelete

const productimgdelete=async(req,res)=>{
  try {
      const element = req.params.element;
      const productId = req.params.productId;
      const updatedProduct = await productCollection.findByIdAndUpdate(
          productId,
          { $pull: { images: element } },
          { new: true }
      );
      res.redirect(`/admin/updateproduct/${productId}`);
  } catch (error) {
      console.error('Error removing image:', error);
      res.status(500).send('Error removing image');
  }

}

//productdelete

const productdelete = async (req, res) => {
  try {
      const id = req.params.id
      await productCollection.findOneAndUpdate({ _id: id },{$set:{isAvailable:false}});
      req.session.message = {
        message : 'Product Deleted',
        type : 'success',
      }
      res.redirect('/admin/productlist')
  }
  catch (err) {
      console.error('Error :', err);
      res.status(500).json({ error: 'Internal server error' });
  }
}

//logout
const logout = (req,res) => {
  req.session.message = {
    message : 'Logout Successfully',
    type : 'success',
  }
  req.session.admin = null;
  res.redirect('/admin/signin');
}



module.exports ={
   getsignin,home,signin,productlist,addProduct,userslist,block,unblock,postaddProduct,addCategory,postaddCategory,categoryList,
   editProduct,postproductupdate,productimgdelete,productdelete,editCategory,postEditCategory,deletecategory,logout
}