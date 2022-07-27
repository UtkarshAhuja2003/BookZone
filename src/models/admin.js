const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const adminSchema=new mongoose.Schema({
    adminfirstname:{
         type:String,
         required:true
    },
    adminlastname:{
        type:String,
        required:true
    },
    adminschoolid:{
        type:Number,
        required:true,
        unique:true
    },
    adminemail:{
        type:String,
        required:true,
        unique:true
    },
    adminpassword:{
        type:String,
        required:true,
    },
    admincpassword:{
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


adminSchema.methods.generateAuthTokenAdmin=async function(){
    try{
        console.log(this._id);
        const token= jwt.sign({_id:this._id.toString()},process.env.ADMIN_SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token
    }
    catch(error){
        res.send("error"+error)
        console.log("error"+error);
    }
}


adminSchema.pre("save",async function (next){
    
    if(this.isModified("adminpassword")){
        this.adminpassword=await bcrypt.hash(this.adminpassword,5)
        this.admincpassword=await bcrypt.hash(this.adminpassword,5)
    }
})


const Admin=new mongoose.model("Admin",adminSchema)

module.exports=Admin;