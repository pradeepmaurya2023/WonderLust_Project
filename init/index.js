// including mongoose
const mongoose = require('mongoose');

// requiring data
const initData = require('./data.js');

// requiring schema and model
const Listing = require('../models/listing.js');

// establishing connection with mongoose
main().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1/wanderlust');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);

    console.log('Data is inserted');
}

initDB();