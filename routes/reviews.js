const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Reviews
// post review
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing.id}`)
}));

// Delete review
// MongoDB Operator: $pull
// Definition: The $pull operator removes from an existing array all 
// instances of a value or values that match a specified condition.

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
        req.flash("error", "Review you requested does not exist!");
        return res.redirect(`/listings/${id}`);
    }
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
