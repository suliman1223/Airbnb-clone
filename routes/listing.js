const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');

const {isLoggedIn,isOwner,isReviewAuthor}=require('../middleware/middleware.js');
const ExpressError = require('../utils/ExpressError.js');
const { userListingSchema,reviewSchema } = require('../Schema.js');
const flash=require('connect-flash');


const mongoose = require('mongoose');
const User = require('../model/db');
const Reviews=require('../model/review.js');

const validateListings=(req,res,next)=>{
    const listingError = userListingSchema.validate(req.body);
    if(listingError.error){
        throw new ExpressError(400,listingError.error);
    }else{
        next();
    }
}
const validateReviews=(req,res,next)=>{
    const listingError = reviewSchema.validate(req.body);
    if(listingError.error){
        throw new ExpressError(400,listingError.error);
    }else{
        next();
    }
}


router.get('/', async (req, res) => {


    const allUsers = await User.find({});
   

    res.render("listings/index", { users: allUsers });
});
router.get('/new', isLoggedIn,(req, res) => {
    res.render("listings/new");
});
router.get('/:id/edit', isLoggedIn,isOwner,async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("listings/edit", { user: user });

});


router.get('/:id', async (req, res) => {
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
});
router.post('/', isLoggedIn, validateListings,wrapAsync(async (req, res) => {
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

}));
router.post('/:id/reviews',isLoggedIn,validateReviews,wrapAsync(async(req,res)=>{
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

}))
router.delete('/:id/reviews/:idk',isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    
    let id=req.params.id;
    let reviewId=req.params.idk;
    ;
    await User.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success',"Review Deleted");
    res.redirect(`/listing/${id}`);

}));
router.put('/:id',validateListings,isLoggedIn,isOwner,wrapAsync (async (req, res) => {
    const { id } = req.params;
    const { title, price, image, description, location, country } = req.body;
 
    const user = await User.findByIdAndUpdate(id, { title, price, image, description, location, country }, { new: true });
    if (!user) {
        return res.status(404).send("User not found");
    }
    req.flash('success',"Updated Listing");
    res.redirect(`/listing/${id}`);
}));

router.delete('/:id',isLoggedIn,isOwner ,async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    req.flash('success',"Deleted Listing");

    res.redirect('/listing');
});



module.exports=router;
