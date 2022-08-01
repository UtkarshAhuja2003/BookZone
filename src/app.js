require("dotenv").config()
const express=require("express")
const app=express()
const path=require("path")
const ejs=require("ejs")
const bcrypt=require("bcryptjs")
const cookieParser=require("cookie-parser")
const adminauth=require("./middleware/adminauth")
const studentauth=require("./middleware/studentauth")
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

require("./db/conn")
const Admin=require("./models/admin")
const Student=require("./models/student")
const Book=require("./models/books")
const Uploadbooks=require("./models/adminbooks")
const { json }=require("express")

const port=process.env.PORT||3000

const static_path=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../templates/views")
const partial_path=path.join(__dirname,"../templates/partials")

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path))
app.set("view engine","ejs")
app.set("views",template_path)
// ejs.registerPartials(partial_pat h)

app.get("/",(req,res)=>{
   res.render("index")
})

app.get("/secret",adminauth,(req,res)=>{
   // console.log(`this is cookie  ${req.cookies.jwt}`);
    res.render("secret")
})

app.get("/uploadBook", adminauth,(req,res)=>{
  res.render("uploadBook")
})

app.post("/uploadBook",adminauth, async(req,res)=>{
  try {
    const book = new Uploadbooks({
      bookname : req.body.bookname,
      bookid :req.body.bookid,
      schoolid : req.body.schoolid,
      quantity :req.body.quantity,
    })
    const uploadbooks = await book.save()
    res.render("uploadBook")
  } catch (e) {
    console.log(e);
  }
})

app.get("/logout",adminauth,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((elem)=>{
            return elem.token!=req.token
        })

        res.clearCookie("jwt")
        console.log("logout done");
        await req.user.save()
        res.render("index")
    } catch (error) {
        res.status(500).send(error)
    }
})



app.get("/studentprofile",studentauth,async(req,res)=>{
    // console.log(`this is cookie  ${req.cookies.jwt}`);
    // const token=req.user.studentfirstname
    // // const id=await Student.findOne({token})
    // console.log(`this is name ${token}`)
   
    
    
    const id1=req.user.studentEnrollment
    const id=await Book.findOne({studentid:id1})
   const booknames=[]
        for(let i=0;i<id.book.length;i++){
            // console.log(id.book[i].bookname)
            booknames[i]=id.book[i].bookname;
        }
        const bookissue=[]
        for(let i=0;i<id.book.length;i++){
            // console.log(id.book[i].bookname)
            bookissue[i]=id.book[i].dateIssued;
        }
        const bookreturn=[]
        for(let i=0;i<id.book.length;i++){
            // console.log(id.book[i].bookname)
            // bookreturn[i]=(id.book[i].dateIssued);
        }
        const bookreturned=[]
        for(let i=0;i<id.book.length;i++){
            // console.log(id.book[i].bookname)
            
            bookreturned[i]=(id.book[i].datereturned);
        }
        
        
    
    const firstname=req.user.studentfirstname
    const lastname=req.user.studentlastname
    const fullname=firstname+" "+lastname
    // const studentprofile=new('studentprofile')
    // studentprofile.querySelector('studentname').innerHTML=id.studentfirstname
    // console.log(id.studentfirstname);
     res.render("studentprofile",{
        name:fullname,
        email:req.user.studentemail,
        enrollment:req.user.studentEnrollment,
        studentschoolname:req.user.studentschoolname,
        a:booknames,
        b:bookissue,
        c:bookreturn,
        d:bookreturned
     })
    // res.render("studentprofile")
 })

 app.get("/adminProfile",adminauth,async(req,res)=>{
    // const token=req.user.tokens
    // const id=await Admin.findOne({token:token})
    const firstname=req.user.adminfirstname
    const lastname=req.user.adminlastname
    const fullname=firstname+" "+lastname
     res.render("adminProfile",{
        name:fullname,
        email:req.user.adminemail,
        adminschoolid:req.user.adminschoolid,
        adminschoolname:req.user.adminschoolname,
     })
 })

app.post("/adminProfile", async(req, res)=>{
  try {
    const book1={
        bookid:req.body.studentBookId,
        bookname:req.body.studentBookName,
        dateIssued:req.body.studentDateIssued,
        datereturned:req.body.studentDateReturned
    }

    const id=await Book.findOne({studentid:req.body.bookStudentId})
    if(!id){
        const bookIssued = new Book({
      studentid:req.body.bookStudentId,
      book:book1
    });
    const books=await bookIssued.save()

    }
    else{
        id.studentid=req.body.bookStudentId
    id.book=id.book.concat(book1)
    const books = await id.save();
    }


    res.status(201).render("index");

  } catch (e) {
    console.log(e);
  }
})

 app.get("/logoutstudent",studentauth,async(req,res)=>{
     try {
         req.user.tokens=req.user.tokens.filter((elem)=>{
             return elem.token!=req.token
         })

         res.clearCookie("jwt")
         console.log("logout done");
         await req.user.save()
         res.render("index")
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
                studentschoolname:req.body.studentschoolname,
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
                adminschoolname:req.body.adminschoolname,
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
