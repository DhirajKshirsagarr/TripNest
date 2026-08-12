const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const { title } = require('process');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

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




// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By The beach",
//         price:1200,
//         location:"calangute, Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing")

// });

app.get("/", (req, res) => {
    res.send("Welcome to My Frist major project");
})

// Index route
app.get("/listing", wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
}));

// new Route
app.get("/listing/new", (req, res) => {
    res.render("listing/new.ejs");
})

// Create Route
app.post("/listing", wrapAsync(async (req, res, next) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send Vaild data for listing ")
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));

// Show route
app.get("/listing/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
}));

// Edit Route
app.get("/listing/:id/edit", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}));

// Update Route
app.put("/listing/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
}));


// Delete Route
app.delete("/listing/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listing");
}));

// for all other requests
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, nex) => {
    let { statusCode = 500, message = "Somthing Went Wrong!" } = err;
    res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server listining at Port : 8080");
});

// Listing.deleteMany({title:"Sai Palace"},{}).then((res)=>{console.log(res);
// })