const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapasync.js");


const Listing = require("../models/listing.js");
const {isLogedIn} = require("../middlewares.js");
const {isOwner} = require("../middlewares.js");
const {validateListing} = require("../middlewares.js");
const listingController = require("../controller/listing.js");



//index route
router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",isLogedIn, listingController.renderNewForm );

//show route
router.get("/:id",wrapAsync( listingController.showListings));


//create route
router.post("/",isLogedIn,validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLogedIn,isOwner,wrapAsync(listingController.editListing));

//update route
router.put("/:id",isLogedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLogedIn,isOwner,wrapAsync( listingController.deleteListing ));

module.exports = router;