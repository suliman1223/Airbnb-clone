module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You just be loggedIn to create Edit Deelte listing");
        return res.redirect('/login');

    }
    next();

}
module.exports.savedOriginalUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();

}