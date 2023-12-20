const express = require("express");
const router = express.Router({mergeParams:true});


const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapasync.js");
const {validateReview, isLogedIn, isReviewAuthor} = require("../middlewares.js");



//review route
router.post("/",isLogedIn,validateReview, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save()
    await listing.save()
    req.flash("success", "new review created");
    res.redirect(`/listings/${id}`);
}));


//delete review route
router.delete("/:reviewId",isLogedIn,isReviewAuthor,wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;