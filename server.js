const express = require('express');
const path = require('path');
const db = require('./database/dbConnect');
const user = require('./routes/user');
const admin = require('./routes/admin');


const app = express();



const port = process.env.PORT || 4000;

app.set('views','views')
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));


//user
app.use('/',user);

//admin
app.use('/admin',admin);




app.listen(port,()=>{
    console.log("server on http://localhost:4000")
})