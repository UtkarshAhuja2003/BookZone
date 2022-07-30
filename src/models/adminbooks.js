const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const uploadbookSchema=new mongoose.Schema({
  bookname: {
    type: "string",
    required: true,
  },
  bookid: {
    type: "string",
    required: true,
  },
  schoolid : {
    type: "string",
    required : true
  },
  quantity : {
    type: "number",
    required : true
  }
})

const Uploadbook=new mongoose.model("Uploadbook",uploadbookSchema)

module.exports=Uploadbook;
