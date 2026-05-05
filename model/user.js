const { required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose').default;
const Schema = mongoose.Schema;

const mainSchema=new Schema({
    email:{
        type:String,
        required:true,

    }
})

mainSchema.plugin(passportLocalMongoose);
const Player=mongoose.model('Player',mainSchema);
module.exports=Player;