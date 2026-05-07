const express = require('express');
const router = express.Router();
const Player = require('../model/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const wrapAsync = require('../utils/wrapAsync');
const { savedOriginalUrl } = require('../middleware/middleware');
const userController=require('../controllers/user');


router.get('/signup',userController.signupPage )
router.post('/signup', wrapAsync(userController.signupController));

router.get('/login',userController.loginPage);

router.post(
    '/login',
    savedOriginalUrl, // ✅ put here
    passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }),
    wrapAsync(userController.loginPost)
);
router.get('/logout', (req, res, next) => {

    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "User Logout Successfully");

        res.redirect('/listing');
    })
})
module.exports = router;