const express=require('express');
const app=express();
const path=require('path');
const userModel=require('./models/user');
app.set("view engine","ejs");

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.render("index");
})
app.post('/create',async (req,res)=>{
    let {name, email,username}=req.body;
    if (!name || !email || !username) {
        return res.status(400).json({ error: "All fields (name, email, username) are required." });
    }
   let createdUser= await userModel.create({
        name,
        email,
        username
    })
    res.redirect('/read');
})
app.get('/read',async (req,res)=>{
    let users=await userModel.find();
    res.render("read",{users});
})
app.get('/delete/:id',async (req,res)=>{
    let users=await userModel.findOneAndDelete({_id:req.params.id});
    res.redirect('/read');
})
app.get('/edit/:userid',async (req,res)=>{
    let user= await userModel.findOne({_id:req.params.userid});
    res.render("updatepg",{user});
})
//At first gets data about the user via route using user.id
//then if there is changes posts that data using the below route
app.post('/update/:userid',async (req,res)=>{
    let {name, email,username}=req.body;
    let user= await userModel.findOneAndUpdate({_id:req.params.userid},{name, email,username});
    res.redirect('/read');
})



app.listen(3000);




//Creating a App . In that with the help of using form create USers and Save them in DB and can show them in a otheer  