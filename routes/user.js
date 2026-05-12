const express = require('express');
const router = express.Router();

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
router.get('/logout',userController.logoutP);
module.exports = router;