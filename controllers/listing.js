const mongoose = require('mongoose');
const User = require('../model/db');
const Reviews = require('../model/review.js');


const flash=require('connect-flash');

module.exports.index = async (req, res) => {


    const allUsers = await User.find({});


    res.render("listings/index", { users: allUsers });
}
module.exports.IsById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("listings/edit", { user: user });

}
module.exports.newPage = (req, res) => {
    console.log("New page")
    res.render("listings/new");
}

module.exports.showPage = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if (!user) {
        return res.status(404).send("User not found");
    }
    console.log(user);
    res.render("listings/show", { user });
}

module.exports.addnewDetails=async (req, res) => {
    const { title, price, image, description, location, country } = req.body;
    const newUser = new User({
        title,
        price,
        image,
        description,
        location,
        country,
        owner: req.user._id
    });
    await newUser.save();
     req.flash('success',"user Created Successfully");
    res.redirect('/listing');

}

module.exports.reviewDetails=async(req,res)=>{
    const listId=req.params.id;
    
    const listing=await User.findById(listId);
    const newReview=new Reviews(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Data saved Successfully.");
    req.flash('success',"Review Created");
    res.redirect(`/listing/${listId}`);

}
module.exports.deleteReview=async(req,res)=>{
    
    let id=req.params.id;
    let reviewId=req.params.idk;
    ;
    await User.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success',"Review Deleted");
    res.redirect(`/listing/${id}`);

}
module.exports.updateListing=async (req, res) => {
    const { id } = req.params;
    const { title, price, image, description, location, country } = req.body;
 
    const user = await User.findByIdAndUpdate(id, { title, price, image, description, location, country }, { new: true });
    if (!user) {
        return res.status(404).send("User not found");
    }
    req.flash('success',"Updated Listing");
    res.redirect(`/listing/${id}`);
}
module.exports.deleteListing=async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    req.flash('success',"Deleted Listing");

    res.redirect('/listing');
}
