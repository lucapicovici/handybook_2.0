var express  = require("express"),
    router   = express.Router(),
    passport = require("passport");

var User    = require("../models/user.js"),
    Service = require("../models/service.js");

router.get("/profile/services", isLoggedIn, function(req, res){
    Service.find({'author.id': req.user.id})
        .populate("author.id")
        .exec(function(err, services){
            if (err) console.log(err);
            else {
                res.render("services/index", {services: services, categoryType: "Your Services"});
            }
        });
});

router.get("/profile/:id", isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, user){
        if (err) {
            console.log(err);
        } else {
            res.render("ucp/index", {user: user});
        }
    })
});

// EDIT
router.get("/profile/:id/edit", isLoggedIn, checkProfileOwnership, function(req, res){
    User.findById(req.params.id, function(err, user){
        if (err) {
            console.log(err);
        } else {
            res.render("ucp/edit", {user: user});
        }
    })
});

// UPDATE
router.put("/profile/:id", isLoggedIn, checkProfileOwnership, function(req, res){
    var tempPassword = "", tempRating = 0;
    User.findById(req.params.id, function(err, user){
        if (err) {
            console.log(err);
        } else {
            tempPassword = user.password;
            tempRating = user.rating;
        }
    });
    
    setTimeout(function(){ 
        var formData = req.body.profile;
        var newProfile = {
            email: req.user.email,
            password: tempPassword,
            rating: tempRating,
            username: formData.username,
            name: formData.name,
            phone: formData.phone,
            profession: formData.profession,
            skills: formData.skills,
            photo: formData.photo
        };
        
        User.findByIdAndUpdate(req.params.id, newProfile, function(err, user){
            if (err) {
                console.log(err);
            } else {
                res.redirect("/user/profile/" + req.user._id);
            }
        })
    }, 1250);
});

// Logout
router.get("/logout", isLoggedIn, function(req, res){
    req.logout();
    res.redirect("/");
});

// Middleware for route protection
router.use("/", notLoggedIn, function(req, res, next){
    next();
});

// Sign up
router.get("/register", function(req, res){
    res.render("user/register", {errMsg: req.flash("error")});
});

router.post("/register", passport.authenticate("local.signup", {
    failureRedirect: "/user/register",
    failureFlash: true
}), function(req, res){
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect("/");
    }
});

// Login
router.get("/login", function(req, res){
    res.render("user/login", {errMsg: req.flash("error")});
});

router.post("/login", passport.authenticate("local.signin", {
    failureRedirect: "/user/login",
    failureFlash: true
}), function(req, res){
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect("/");
    }
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/user/login");
};

function notLoggedIn(req, res, next){
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
};

function checkProfileOwnership(req, res, next) {
    if (req.isAuthenticated()) {
		User.findById(req.params.id, function(err, user){
			if (err || !user) {
				console.log(err);
				console.log("User not found");
				res.redirect("back");
			} else {
				// Does user own this profile?
				if (req.params.id == req.user._id) {
					next();
				} else {
					console.log("You don't have permission to do that!");
					res.redirect("/");
				}
			}
		});
	} else {
		console.log("You need to be logged in to do that.");
		res.redirect("back");
	}
}

module.exports = router;