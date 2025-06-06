const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  };

  module.exports.renderNewForm= (req,res)=>{
        res.render("listings/new.ejs");
        };

        module.exports.showListing=async (req,res)=>{
            let {id} = req.params;
            const listing =await Listing.findById(id)
            .populate({
              path:"reviews",
            
              populate:{
                path:"author",
            },
            })
            .populate("owner");
            if(!listing){
              req.flash("error","Listing you requested for does not exist");
            return res.redirect("/listings");
            }
            //console.log(listing);
          
            res.render("listings/show.ejs",{listing});
            };

            module.exports.createListing=async(req,res,next)=> {
           
                  //let {title,description,price,location,category} = req.body;
                //  if(!req.body.listing){
                //   throw new ExpressError(400,"Send valid data for listing");
                //  }
               let response = await geocodingClient.forwardGeocode({
                 query: req.body.listing.location,
                 limit: 1,
                         })
                      .send();
                let url = req.file.path;
                let filename = req.file.filename;
                 const newListing=new Listing(req.body.listing);
              newListing.image = {url,filename};
                   newListing.geometry = response.body.features[0].geometry;
                    //console.log(req.user);
                    newListing.owner=req.user._id;
                   let savedListing= await newListing.save();
                   console.log(savedListing);
                    req.flash("success","New listing created successfully");
                    res.redirect("/listings");
                  
                };

                module.exports.renderEditForm=async(req,res)=>{
                    let {id} = req.params;
                    const listing =await Listing.findById(id);
                    if(!listing){
                      req.flash("error","Listing you requested for does not exist");
                     res.redirect("/listings");
                    }
                    let orignalImageUrl = listing.image.url;
                   orignalImageUrl= orignalImageUrl.replace("/upload/","/upload/w_300/")
                  res.render("listings/edit.ejs",{listing,orignalImageUrl});
                    //return res.render("listings/edit.ejs",{listing});
                };
                module.exports.updateListing=async(req,res)=>{
                    
                    let {id} = req.params;
                
                 let listing =  await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
                 if(typeof req.file !== "undefined"){  
                 let url = req.file.path;
                let filename = req.file.filename;
                listing.image = {url,filename};
                await listing.save();
                }
                    // const listing =await Listing.findByIdAnd
                   // const listing =await Listing.findByIdAndUpdate(id,req.body.listing);
                    req.flash("success","Listing updated successfully");
                    res.redirect(`/listings/${id}`);
                   
                };
              
                module.exports.destroyListing=async(req,res)=>{
                    let {id} = req.params;
                   let deletedlisting = await Listing.findByIdAndDelete(id);
                   console.log(deletedlisting);
                    req.flash("success","Listing deleted successfully");
                
                   res.redirect("/listings");
                  };