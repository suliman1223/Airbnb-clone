const mongoose = require('mongoose');
const User = require('../model/db.js');
const initData = require('./data.js');

main().then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/mydatabase1');
}

const initDatas=async()=>{
    await User.deleteMany({});
    await User.insertMany(initData.datas);
    console.log('Data initialized successfully');
}

initDatas();