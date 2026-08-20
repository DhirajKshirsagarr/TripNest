const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const { title } = require('process');
const ExpressError = require("./utils/ExpressError.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);


let MONGO_URL = "mongodb://127.0.0.1:27017/airbnb"

main().then(() => {
    console.log("connection build successfuly");
}).catch((err) => {
    console.log("error :", err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("TripNest")
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

// for all other requests
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Somthing Went Wrong!" } = err;
    res.status(statusCode).render('error.ejs', { err });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server listining at Port : 8080");
});

// Listing.deleteMany({title:"Sai Palace"},{}).then((res)=>{console.log(res);
// })