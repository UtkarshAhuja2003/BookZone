const mongoose =require("mongoose")

const DB ="mongodb+srv://ahuja_utkarsh:utkarsh@cluster0.y6holyz.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log(e);
})