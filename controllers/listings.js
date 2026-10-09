const Listing = require("../models/listing")

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("listing/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.editForm = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl= originalImageUrl.replace("/uploade","/upload/h_300,w_250")
    res.render("listing/edit.ejs", { listing ,originalImageUrl});
}

module.exports.updateListing = async (req, res, next) => {

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !=="undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename }
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    if (!delListing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}