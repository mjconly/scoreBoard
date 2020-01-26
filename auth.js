const ensureAuthenticated = {
  isAuthenticated: (req, res, next) => {
    if(req.isAuthenticated()){
      return next();
    }
    req.flash("errorMsg", "Please login");
    res.redirect("/users/login");
  }
}


module.exports = ensureAuthenticated;
