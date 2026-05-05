const express = require('express');
const router = express.Router();
const Player = require('../model/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const wrapAsync = require('../utils/wrapAsync');
const { savedOriginalUrl } = require('../middleware/middleware');


router.get('/signup', (req, res) => {

    res.render("user/signup.ejs");
})
router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new Player({ username, email });
        const registerdUser = await Player.register(newUser, password);
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Project!");
            res.redirect('/listing')

        })
            ;
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('/signup');
    }

}));

router.get('/login', (req, res) => {
    console.log("Router.get api hits");
    res.render('user/login.ejs');
});

router.post(
    '/login',
    savedOriginalUrl, // ✅ put here
    passport.authenticate("local", {
        failureRedirect: '/login',
        failureFlash: true
    }),
    async (req, res) => {
        req.flash("success", "Welcome to Our project!!");

        let urlredirect = res.locals.redirectUrl || "/listing";

        res.redirect(urlredirect);
    }
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