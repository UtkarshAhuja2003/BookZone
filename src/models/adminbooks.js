const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const uploadbookSchema=new mongoose.Schema({
  // bookname: {
  //   type: "string",
  //   required: true,
  // },
  // bookid: {
  //   type: "string",
  //   required: true,
  // },
  schoolid : {
    type: "string",
    required : true
  },
  // quantity : {
  //   type: "number",
  //   required : true
  // },
  // image:[{
    
  //  img:{
  //     type:String,
  //   },
    
  // }]
  book:[{
     bookname: {
    type: "string",
    required: true,
  },
  bookid: {
    type: "string",
    required: true,
  },
   quantity : {
    type: "number",
    required : true
  },
  img:{
    type:String
  },
    
  }]
    
})

const Uploadbook=new mongoose.model("Uploadbook",uploadbookSchema)

module.exports=Uploadbook;
