const express=require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });

router.route("/")
 //index route
.get(wrapAsync(listingController.index))

  // create route
  .post(
    isLoggedIn ,
  upload.single('listing[image]'),
  validateListing,// validateListing is a middleware to check the data + it will always lower than the upload.single('listing[image]'), this middleware.
    wrapAsync(listingController.createListing)
  );

  //new route (this route always upper than show route because it will recognize new s=as a id)
  router.get("/new",isLoggedIn ,listingController.renderNewForm);
    

  router.route("/:id")
  //show route
  .get( wrapAsync(listingController.showListing))

//update
.put(
  
    isLoggedIn ,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))

  //delete
  .delete(
    isLoggedIn ,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );
  
//edit route
  router.get("/:id/edit",
    isLoggedIn ,
    isOwner,
    wrapAsync( listingController.renderEditForm));
 
  
  module.exports=router;