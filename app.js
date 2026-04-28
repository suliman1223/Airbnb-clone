const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./model/db');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { userListingSchema } = require('./Schema.js');

app.engine("ejs", ejsMate);

app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


main().then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/mydatabase1');
}
const validateListings=(req,res,next)=>{
    const listingError = userListingSchema.validate(req.body);
    if(listingError.error){
        throw new ExpressError(400,listingError.error);
    }else{
        next();
    }
}


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/listing', async (req, res) => {
    const allUsers = await User.find({});

    res.render("listings/index", { users: allUsers });
});
app.get('/listings/new', (req, res) => {
    res.render("listings/new");
});
app.get('/listings/:id/edit', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("listings/edit", { user: user });

});


app.get('/listing/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render("listings/show", { user });
});
app.post('/listings', validateListings,wrapAsync(async (req, res) => {
    const { title, price, image, description, location, country } = req.body;
    const newUser = new User({ title, price, image, description, location, country });
    await newUser.save();
    res.redirect('/listing');

}));
app.put('/listings/:id',validateListings,wrapAsync (async (req, res) => {
    const { id } = req.params;
    const { title, price, image, description, location, country } = req.body;
    const user = await User.findByIdAndUpdate(id, { title, price, image, description, location, country }, { new: true });
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.redirect(`/listing`);
}));

app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).send("User not found");
    }

    res.redirect('/listing');
});

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
