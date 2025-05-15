const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview=async(req,res)=>{


    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success","New review created successfully");
    res.redirect(`/listings/${listing._id}`);
  
  };

    
    
  module.exports.destroyReview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`);
  };