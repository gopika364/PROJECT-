//signin
const signin = (req,res)=>{
    res.render("admin/signin");
}

//home
const home = (req,res)=>{
    res.render("admin/home");
}

//addProduct
const addProduct = (req,res)=>{
    res.render("admin/addProduct");
}

//productlist
const productlist = (req,res)=>{
    res.render("admin/productlist");
}




module.exports ={
    home,signin,addProduct,productlist
}