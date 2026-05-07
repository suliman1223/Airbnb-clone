const mongoose = require('mongoose');
const User = require('../model/db');
const Reviews= require('../model/review');

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You just be loggedIn to create Edit Deelte listing");
        return res.redirect('/login');

    }
    next();

}
module.exports.savedOriginalUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();

}
module.exports.isOwner = async(req, res, next) => {
    const{id}=req.params;
    const userId = await User.findById(id);
    if (!userId.owner.equals(req.user._id)) {
        req.flash("error", "User Not The owner of this listing");
        return res.redirect(`/listing/${id}`)
    }
    next();
}
module.exports.isReviewAuthor = async(req, res, next) => {
    const{id,idk}=req.params;
    const review = await Reviews.findById(idk);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "User Not The author of this review");
        return res.redirect(`/listing/${id}`)
    }
    next();
}