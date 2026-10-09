const User=require("../models/user");


module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup=async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.logIn(registeredUser, (e) => {
            if (e) {
                return next(e);
            }
            req.flash('success', "Welcome to TripNest");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error:", e);
        res.redirect("/signup")
    }

}

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
}

module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to Tripnest!");
    let rediretUrl=res.locals.redirectUrl ||"/listings";
    res.redirect(rediretUrl);
}

module.exports.logout=(req, res, next) => {
    req.logOut((error) => {
        if (error) {
            return next(error);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
}