if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
const expressError = require("./utils/expressError.js");

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

// app.get("/", (req, res) => {
//     res.send("this is the root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
   res.locals.successMsg = req.flash("success");
   res.locals.errorMsg = req.flash("error");
   res.locals.user = req.user;
   next();
})

app.get("/demouser", async (req,res)=>{
    let fakeuser = new User({
        email: "fakeuser@getMaxListeners.com",
        username: "fake-user"
    });

    let registeredUser = await User.register(fakeuser,"password");
    res.send(registeredUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/",userRouter);



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