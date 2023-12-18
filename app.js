const express = require("express");
const app = express();
const wrapAsync = require("./utils/wrapasync.js");
const expressError = require("./utils/expressError.js");
const listingSchema = require("./Schema.js");
const reviewSchema = require("./Schema.js");

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then((res) => {
        console.log("connection succesfull");
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}



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


app.get("/", (req, res) => {
    res.send("this is the root");
});

app.use("/listings",listings);


//review route
app.post("/listings/:id/review",validateReview, wrapAsync(async (req,res)=>{
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
app.delete("/listings/:id/review/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found!"));
})

app.use((err, req, res, next) => {
    let{status=500,message="something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});