const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing.id}`)
}

module.exports.destroyReview=async (req, res) => {
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
}