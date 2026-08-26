const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const { title } = require('process');
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const { read } = require('fs');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);
    

let MONGO_URL = "mongodb://127.0.0.1:27017/TripNest"

main().then(() => {
    console.log("connection build successfuly");
}).catch((err) => {
    console.log("error :", err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOption={
    secret:"mySuperSecreate",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, // 7 day in millisecond
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.get("/", (req, res) => {
    res.send("TripNest")
})

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error"); 
    res.locals.currUser=req.user;
    next();
})

// app.get("/signup",async (req,res)=>{
//     let fackUser={
//         email:"student@gmail.com",
//         username:"abcd",
//     }

//     let registerUser=await User.register(fackUser,"pass1234");
//     res.send(registerUser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// for all other requests
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let { statusCode = 500, message = "Somthing Went Wrong!" } = err;
    console.error(err);
    res.status(statusCode).render('error.ejs', { err });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server listining at Port : 8080");
});

// Listing.deleteMany({title:"Sai Palace"},{}).then((res)=>{console.log(res);
// })
