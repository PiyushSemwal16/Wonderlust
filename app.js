if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
//console.log(process.env.SECRET);


const express=require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
const path=require("path");
const { url } = require("inspector");
const methodOverride=require("method-override")
const ejsMate = require("ejs-mate");
const sampleListings = require("./init/data.js"); 
//const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const { listingSchema , reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(()=>{
console.log("connected to DataBase");
})
.catch(err => console.log(err));


async function main() {
 // await mongoose.connect('mongodb://127.0.0.1:27017/portfolio');
 await mongoose.connect(dbUrl);
}

const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time period in seconds
  });
  store.on("error", ()=>{
    console.log("Error in MONGO Store",err);
 });
const sessionOptions={
  store,
          secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days
    },
};




// const Initdb = async()=>{
//   await Listing.deleteMany({});
//   await Listing.insertMany(Initdb.sampleListings);
//   console.log("he");
// }
// Initdb();
// const Initdb = async () => {
//   try {
//       await Listing.deleteMany({}); // Delete old data
//       await Listing.insertMany(sampleListings); // ✅ Corrected here
//       console.log("🎉 Database Seeded Successfully!");
//   } catch (err) {
//       console.error("❌ Error initializing database:", err);
//   } finally {
//       mongoose.connection.close(); // Close connection after seeding
//   }
// };

// Initdb();
// app.get("/", (req,res)=>
// {
//     res.send("Hello, World!");
// });
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next (new ExpressError(404,"Page not found"));
});


app.use((err,req,res,next)=>{
  let statusCode=err.statusCode||500;
  let message=err.message||"Something went wrong";
 // res.status(statusCode).send(message);
  //res.send("something went wrong");
  res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080, ()=>{
console.log("Server is running on port 8080");
});