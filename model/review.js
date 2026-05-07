const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Types.ObjectId,
       
        ref:'Player'
    }
});
module.exports=mongoose.model("Reviews",reviewSchema);