const express = require("express");
const app = express();

const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

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

const sessionOptions = {
    secret: "supersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly :true
    }
};

app.get("/", (req, res) => {
    res.send("this is the root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
   res.locals.successMsg = req.flash("success");
   res.locals.errorMsg = req.flash("error");
   next();
})

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);


app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});