const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reviews=require('./review');
const userSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    
    image: {
        type: String,
        default:"https://unsplash.com/photos/man-petting-a-dog-with-boxes-in-background-TXdLi87NmJQ",
        set:(v) => v === "" ? "https://unsplash.com/photos/man-petting-a-dog-with-boxes-in-background-TXdLi87NmJQ" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Reviews"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Player"
    },
});
userSchema.post('findOneAndDelete',async(data)=>{
    await Reviews.deleteMany({_id:{$in:data.reviews}});
    

})

const User = mongoose.model('User', userSchema);
module.exports = User;
