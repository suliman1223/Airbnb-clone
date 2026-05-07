const express=require('express');
const router=express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn,isOwner,isReviewAuthor}=require('../middleware/middleware.js');
const ExpressError = require('../utils/ExpressError.js');
const { userListingSchema,reviewSchema } = require('../Schema.js');

const controllerListing=require('../controllers/listing.js');


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
router.route('/')
.get(wrapAsync(controllerListing.index))
.post( isLoggedIn, validateListings,wrapAsync(controllerListing.addnewDetails));
router.get('/new', isLoggedIn,controllerListing.newPage);

router.route('/:id')
.get( wrapAsync(controllerListing.showPage))
.put(validateListings,isLoggedIn,isOwner,wrapAsync (controllerListing.updateListing))
.delete(isLoggedIn,isOwner ,wrapAsync(controllerListing.deleteListing));



router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync(controllerListing.IsById))


router.post('/:id/reviews',isLoggedIn,validateReviews,wrapAsync(controllerListing.reviewDetails))
router.delete('/:id/reviews/:idk',isLoggedIn,isReviewAuthor,wrapAsync(controllerListing.deleteReview));


module.exports=router;
