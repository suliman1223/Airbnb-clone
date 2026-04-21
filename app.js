const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./model/db');
const path = require('path');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


main().then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/mydatabase1');
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


app.get('/listing/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send("User not found");
    }
        res.render("listings/show", { user });
});
app.post('/listings', async (req, res) => {
    const { title, price, image, description, location, country } = req.body;
    const newUser = new User({ title, price, image, description, location, country });
    await newUser.save();
    res.redirect('/listing');
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
