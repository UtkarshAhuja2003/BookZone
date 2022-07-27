const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const studentSchema=new mongoose.Schema({
    studentfirstname:{
         type:String,
         required:true
    },
    studentlastname:{
        type:String,
        required:true
    },
    gender:{
       type:String
    },
    studentEnrollment:{
        type:Number,
        required:true,
        unique:true
    },
    studentage:{
        type:Number,
    },
    studentemail:{
        type:String,
        required:true,
        unique:true
    },
    studentpassword:{
        type:String,
        required:true,
    },
    studentcpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})



studentSchema.methods.generateAuthTokenStudent=async function(req,res){
    try{
        console.log(this._id);
        const token= jwt.sign({_id:this._id.toString()},process.env.STUDENT_SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
        await this.save()
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