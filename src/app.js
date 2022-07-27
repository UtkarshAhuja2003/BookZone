require("dotenv").config()
const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const bcrypt=require("bcryptjs")
const cookieParser=require("cookie-parser")
const adminauth=require("./middleware/adminauth")
const studentauth=require("./middleware/studentauth")

require("./db/conn")
const Admin=require("./models/admin")
const Student=require("./models/student")
const { json }=require("express")

const port=process.env.PORT||3000

const static_path=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../templates/views")
const partial_path=path.join(__dirname,"../templates/partials")

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partial_path)

app.get("/",(req,res)=>{
   res.render("index")
})

app.get("/secret",adminauth,(req,res)=>{
   // console.log(`this is cookie  ${req.cookies.jwt}`);
    res.render("secret")
})

app.get("/logout",adminauth,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((elem)=>{
            return elem.token!=req.token
        })

        res.clearCookie("jwt")
        console.log("logout done");
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get("/secretstudent",studentauth,(req,res)=>{
    // console.log(`this is cookie  ${req.cookies.jwt}`);
     res.render("secretstudent")
 })
 
 app.get("/logoutstudent",studentauth,async(req,res)=>{
     try {
         req.user.tokens=req.user.tokens.filter((elem)=>{
             return elem.token!=req.token
         })
 
         res.clearCookie("jwt")
         console.log("logout done");
         await req.user.save()
         res.render("login")
     } catch (error) {
         res.status(500).send(error)
     }
 })

app.get("/loginStudent",(req,res)=>{
    res.render("loginStudent")
})

app.post("/loginStudent",async(req,res)=>{
    try{
       const studentid=req.body.studentEnrollment
       const studentpassword=req.body.studentpassword

       const id=await Student.findOne({studentEnrollment:studentid})

       const token=await id.generateAuthTokenStudent()
       res.cookie("jwt",token,{
        expires:new Date(Date.now()+3000000),
        httpOnly:true
     })
       const isMatch=await bcrypt.compare(studentpassword,id.studentpassword)

       if(isMatch){
        res.status(201).render("index")
       }
       else{
        res.send("Invalid login details")
       }
    } 
    catch(error){
        console.log(error)
        res.status(400).send("invalid login details")
    }
})

app.get("/loginAdmin",(req,res)=>{
    res.render("loginAdmin")
})

app.post("/loginAdmin",async(req,res)=>{
    try{
       const adminid=req.body.adminschoolid
       const adminemail=req.body.adminemail
       const adminpassword=req.body.adminpassword
       
       const email=await Admin.findOne({adminemail:adminemail})

       const id=await Admin.findOne({adminschoolid:adminid})
       
       const token=await id.generateAuthTokenAdmin()
       res.cookie("jwt",token,{
        expires:new Date(Date.now()+3000000),
        httpOnly:true
     })
       const isMatch=await bcrypt.compare(adminpassword,id.adminpassword)

       if(isMatch){
        res.status(201).render("index")
       }
       else{
        res.send("Invalid login details")
       }
    } 
    catch(error){
        res.status(400).send("invalid login details")
    }
})

app.get("/registerStudent",(req,res)=>{
    res.render("registerStudent")
})

app.post("/registerStudent",async(req,res)=>{
    try{
        const studentpassword=req.body.studentpassword
        const studentcpassword=req.body.studentcpassword
        if(studentpassword===studentcpassword){
             const registerStudent=new Student({
                studentfirstname:req.body.studentfirstname,
                studentlastname:req.body.studentlastname,
                gender:req.body.gender,
                studentEnrollment:req.body.studentEnrollment,
                studentage:req.body.studentage,
                studentemail:req.body.studentemail,
                studentpassword,
                studentcpassword
             })
             
             const token=await registerStudent.generateAuthTokenStudent()
              
             res.cookie("jwt",token,{
                expires:new Date(Date.now()+3000000),
                httpOnly:true
             })

            const register= await registerStudent.save()
            res.status(201).render("index")
        }
    }catch(error){
        res.status(400).send(error)
        console.log(error)
    }
})

app.get("/registerAdmin",(req,res)=>{
    res.render("registerAdmin")
})

app.post("/registerAdmin",async(req,res)=>{
    try{
        const adminpassword=req.body.adminpassword
        const admincpassword=req.body.admincpassword
        if(adminpassword===admincpassword){
             const registerAdmin=new Admin({
                adminfirstname:req.body.adminfirstname,
                adminlastname:req.body.adminlastname,
                adminschoolid:req.body.adminschoolid,
                adminemail:req.body.adminemail,
                adminpassword,
                admincpassword
             })
             
             const token=await registerAdmin.generateAuthTokenAdmin()
             res.cookie("jwt",token,{
                expires:new Date(Date.now()+3000000),
                httpOnly:true
             })
            const registered= await registerAdmin.save()
            res.status(201).render("index")
        }
        else{
            res.send("passwords are not matching")
        }
    }
    catch(error){
        res.status(400).send(error)
    }
})

app.listen(port,()=>{
    console.log("server is running ");
})