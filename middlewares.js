const Listing = require("./models/listing.js");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./Schema.js");
const {reviewSchema} = require("./Schema.js");

module.exports.isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "User must be logged in");
        return res.redirect("/login");
    };
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.user._id)) {
        req.flash("error", "you are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        let errMsg = result.error.details.map(el => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    next()
};

module.exports.validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        let errMsg = result.error.details.map(el => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else {
        next();
    }
};