const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
    .then((res)=>{
        console.log("connection succesfull");
    })
    .catch((err)=>{
        console.log(err);
    })
async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async ()=>{
   await Listing.deleteMany({});
   initdata.data = initdata.data.map((obj)=>({...obj,owner:"6581f035f7c3845e2004559f"}));
   await Listing.insertMany(initdata.data);
   console.log("data was initialized");
}

initDB();