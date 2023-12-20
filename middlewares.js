module.exports.isLogedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","User must be logged in");
        return res.redirect("/login");
    };
    next();
}