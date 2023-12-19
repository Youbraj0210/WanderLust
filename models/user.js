const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    }
    //the username and password will be automatically defined using password
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);