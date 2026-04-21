const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
});

const User = mongoose.model('User', userSchema);
module.exports = User;