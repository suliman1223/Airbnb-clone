const mongoose = require('mongoose');
const User = require('../model/db.js');
const Player = require('../model/user.js');
const initData = require('./data.js');

main()
    .then(() => console.log('Connected to MongoDB'))
    .then(() => initDatas())
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/mydatabase1');
}

const initDatas = async () => {
    await User.deleteMany({});

    const owner = await Player.findOne({});

    if (!owner) {
        throw new Error("No Player found. Create a user first so listings can reference a real owner.");
    }

    const listingsWithOwner = initData.datas.map((obj) => ({
        ...obj,
        owner: owner._id
    }));

    await User.insertMany(listingsWithOwner);

    console.log("Data initialized successfully");
};
