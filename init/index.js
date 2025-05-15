const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
main()
.then(()=>{
console.log("connected to DataBase");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/portfolio');
  }

  const initdb = async()=>
  {await Listing.deleteMany({});
  //initdata.data=initdata.data.map((obj)=>({...obj,owner:"6817906412a376d82a32e07e"}));
  const listingwithowner=initdata.map((obj)=>({...obj,owner:"6817906412a376d82a32e07e"}));
  await Listing.insertMany(listingwithowner);
  console.log("data inserted");
  console.log("database initialized");
  };
  initdb();