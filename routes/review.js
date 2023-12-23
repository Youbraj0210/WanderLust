const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapasync.js");
const {validateReview, isLogedIn, isReviewAuthor} = require("../middlewares.js");
const reviewController = require("../controller/reviews.js");



//review route
router.post("/",isLogedIn,validateReview, wrapAsync(reviewController.createReview));


//delete review route
router.delete("/:reviewId",isLogedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;