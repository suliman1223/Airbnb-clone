const express = require('express');
const router = express.Router();
const Player = require('../model/user');

module.exports.signupController = async (req, res) => {
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

}
module.exports.signupPage = (req, res) => {
    console.log("signIUP")

    res.render("user/signup.ejs");
}
module.exports.loginPage = (req, res) => {
    console.log("login")
    res.render('user/login.ejs');
}
module.exports.loginPost = async (req, res) => {
    req.flash("success", "Welcome to Our project!!");

    let urlredirect = res.locals.redirectUrl || "/listing";

    res.redirect(urlredirect);
}

module.exports.logoutP = (req, res, next) => {

    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "User Logout Successfully");

        res.redirect('/listing');
    })
}