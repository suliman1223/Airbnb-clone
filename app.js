const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./model/db');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const Reviews=require('./model/review.js');
const { wrap } = require('module');
const listingRoute=require('./routes/listing.js');
const userRoute=require('./routes/user.js');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localStrategy=require('passport-local');
const Player=require('./model/user.js');
app.engine("ejs", ejsMate);

app.use(methodOverride('_method'));
const sessionOptions = {
    secret: "mySecreteCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // also fixed
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Player.authenticate()));
passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



main().then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/mydatabase1');
}


const validateReviews=(req,res,next)=>{
    const listingError = reviewSchema.validate(req.body);
    if(listingError.error){
        throw new ExpressError(400,listingError.error);
    }else{
        next();
    }
}
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser = req.user;
    next();
})


app.use('/listing',listingRoute);
app.use('/',userRoute);



app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((error, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = error;
    return res.status(status).render("error.ejs", { message });

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
