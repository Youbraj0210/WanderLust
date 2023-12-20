const express = require("express");
const router = express.Router({mergeParams:true});


const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapasync.js");
const {validateReview} = require("../middlewares.js");



//review route
router.post("/",validateReview, wrapAsync(async (req,res)=>{
    console.log(req.params)
    let {id} = req.params;
    // console.log(id);
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save()
    await listing.save()
    req.flash("success", "new review created");
    console.log("new review saved");
    res.redirect(`/listings/${id}`);
}));


//delete review route
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;