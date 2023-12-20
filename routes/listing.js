const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapasync.js");
const {listingSchema} = require("../Schema.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLogedIn} = require("../middlewares.js");


const validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        let errMsg = result.error.details.map(el=>el.message).join(",");
        throw new expressError(400,errMsg);
    }
    else{
        next()
    }
}

//index route
router.get("/",wrapAsync( async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}));

//new route
router.get("/new",isLogedIn, (req, res) => {
    console.log(req.user);
    
    res.render("listings/new.ejs")
});

//show route
router.get("/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error" , "listing you requested does not exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing })
}));


//create route
router.post("/",isLogedIn,validateListing, wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "new listing created");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",isLogedIn,wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "listing you requested does not exist");
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id",isLogedIn,validateListing,wrapAsync( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLogedIn,wrapAsync( async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
}));

module.exports = router;