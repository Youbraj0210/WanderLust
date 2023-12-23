const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapasync.js");
const { isLogedIn } = require("../middlewares.js");
const { isOwner } = require("../middlewares.js");
const { validateListing } = require("../middlewares.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})


router
    .route("/")
    .get(wrapAsync(listingController.index))
    // .post(isLogedIn, validateListing, wrapAsync(listingController.createListing));
    .post(upload.single("listing[image]"),(req,res)=>{
        res.send(req.file);
    })

//new route
router.get("/new", isLogedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLogedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLogedIn, isOwner, wrapAsync(listingController.deleteListing));


//edit route
router.get("/:id/edit", isLogedIn, isOwner, wrapAsync(listingController.editListing));


module.exports = router;