const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const bookSchema=new mongoose.Schema({
      studentid:{
        type:Number,
      },
      book:[{
        bookid:{
          type:String,
        },
        bookname:{
          type:String,
        },
        dateIssued:{
          type:Date,
        },
        
      }],
      datereturned:[{
        id:{
          type:String,
        },
        date:{
          type:Date,
        }
      }]
      
})

const Book=new mongoose.model("Book",bookSchema)

module.exports=Book;
