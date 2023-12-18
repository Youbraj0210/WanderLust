const express = require("express");
const router = express.Router({mergeParams:true});

const {reviewSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapasync.js");
const expressError = require("../utils/expressError.js");

const validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    console.log(result);
    if(result.error){
        let errMsg = result.error.details.map(el=>el.message).join(",");
        throw new expressError(400,errMsg);
    }
    else{
        next();
    }
}


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
    console.log("new review saved");
    res.redirect(`/listings/${id}`);
}));


//delete review route
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;