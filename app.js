const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const methodOverride=require('method-override');
const Listing=require("./models/listing.js");
const ejsMate=require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")));

app.engine("ejs",ejsMate);


let MONGO_URL="mongodb://127.0.0.1:27017/airbnb"

main().then(()=>{
    console.log("connection build successfuly");
}).catch((err)=>{
    console.log("error :",err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.get("/",(req,res)=>{
    res.send("Welcome to My Frist major project");
})

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

// Index route
app.get("/listing",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listing/index.ejs",{allListings});
})

// new Route
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
})

// Create Route
app.post("/listing",async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
})

// Show route
app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
})

// Edit Route
app.get("/listing/:id/edit",async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
})

// Update Route
app.put("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
})

// Delete Route
app.delete("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    let delListing=await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listing");
})

app.listen(8080,()=>{
    console.log("Server listining at Port : 8080");
})