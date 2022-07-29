const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const studentSchema=new mongoose.Schema({
    studentfirstname:{
         type:String,
         // required:true
    },
    studentlastname:{
        type:String,
        // required:true
    },
    gender:{
       type:String
    },
    studentEnrollment:{
        type:Number,
        // required:truee
        unique:true
    },
    studentage:{
        type:Number,
    },
    studentemail:{
        type:String,
        // required:truee
        unique:true
    },
    studentpassword:{
        type:String,
        // required:truee
    },
    studentcpassword:{
        type:String,
        // required:truee
    },
    tokens:[{
        token:{
            type:String,
            // required:true
        }
    }],
    student:[{
      studentid:{
        type:Number,
      },
      bookid:{
        type:String,
      },
      bookname:{
        type:String,
      },
      dateIssued:{
        type:Date,
      },
      datereturned:{
        type:Date,
      }
    }],
    studentschoolname:{
        type:String,
        // required:true
    }
})



studentSchema.methods.generateAuthTokenStudent=async function(){
    try{
        const user=this
        console.log(user._id);
        const token= jwt.sign({_id:user._id.toString()},process.env.ADMIN_SECRET_KEY)
        user.tokens=user.tokens.concat({token})
        await user.save()
        // console.log("hello");
        return token
    }
    catch(error){
        // res.send("error"+error)
        console.log("error"+error);
    }
}


studentSchema.pre("save",async function (next){

    if(this.isModified("studentpassword")){
        this.studentpassword=await bcrypt.hash(this.studentpassword,5)
        this.studentcpassword=await bcrypt.hash(this.studentpassword,5)
    }
})

const Student=new mongoose.model("Student",studentSchema)

module.exports=Student;
