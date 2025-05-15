const User = require("../models/user");


module.exports.renderSignupForm=(req,res)=>{
   res.render("users/signup.ejs");
};

module.exports.signup=async (req,res)=>{
    try{
        const {username,password,email}=req.body;
        const user= new User({username,email});
        const registeredUser=await User.register(user,password);
req.login(registeredUser,(err)=>{
            if(err) {
                return next(err);
}
req.flash("success","Welcome to our website");
res.redirect("/listings");
    });
            
} catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back to our website");
  // res.redirect("/listings");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout=(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash("success","Your logged out successfully");
        res.redirect("/listings");
      });
    
};