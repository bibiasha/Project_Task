const mongoose=require("mongoose");

const userShcema= new mongoose.Schema({
    id:{
        type:Number,
        unique:true,
        trim: true
    },
    phone_number:{
        type:Number,
        unique:true,
        trim: true
    },
    priority:{
        type:Number,
        enum:[0,1,2],
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean, 
        default: false
    }
})

const User= mongoose.model("User", userShcema);

module.exports=User;