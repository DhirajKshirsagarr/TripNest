const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/TripNest";

main().then(() => {
    console.log("connection build successfuly");
}).catch((err) => {
    console.log("error :", err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map  ((obj) => ({ ...obj, owner: '6a8e836265b388f1ded5a6cf' }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
