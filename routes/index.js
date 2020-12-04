var express  = require("express"),
    mongoose = require("mongoose"),
    router   = express.Router();

var Service = require("../models/service.js"),
    User    = require("../models/user.js");

router.get("/", function(req, res){
    // Service.create({
    //     author: {
    //         id: "5fb93e80e70df7106cdf2334",
    //         name: "Cosmin SRL"
    //     },
    //     title: "Aici va fi un titlu",
    //     about: "Pls help i need money i'm undawateh",
    //     hourlyRate: "$69/h",
    //     rating: 5,
    //     photos: [
    //         {src: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80"}
    //     ]
    // }, function(err, service) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log("Created " + service.author.name);
    //     }
    // });

    Service.find({})
    .populate("author.id")
    .exec(function(err, services){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {services: services});
        }
    });
});

// NEW
router.get("/mechanics/new", isLoggedIn, function(req, res){
    res.render("services/new");
});

// CREATE
router.post("/mechanics", isLoggedIn, function(req, res){
    var formData = req.body.service;
    var newService = {
        author: {
            id: req.user._id,
            name: formData.author
        },
        title: formData.title,
        about: formData.about,
        hourlyRate: formData.hourlyRate,
        photos: [
            {src: formData.photo}
        ]
    };

    Service.create(newService, function(err, service){
        if (err) {
            console.log(err);
        } else {
            console.log("CREATED " + service.title);
            res.redirect("/");
        }
    })
});

// EDIT
router.get("/mechanics/:id/edit", isLoggedIn, checkServiceOwnership, function(req, res){
    Service.findById(req.params.id, function(err, service){
        if (err) {
            console.log(err);
        } else {
            res.render("services/edit", {service: service});
        }
    });
});

// UPDATE
router.put("/mechanics/:id", isLoggedIn, checkServiceOwnership, function(req, res){
    var formData = req.body.service;
    var newService = {
        author: {
            id: req.user._id,
            name: formData.author
        },
        title: formData.title,
        about: formData.about,
        hourlyRate: formData.hourlyRate,
        photos: [
            {src: formData.photo}
        ]
    };
	Service.findByIdAndUpdate(req.params.id, newService, function(err, service){
		if (err) {
			res.redirect("/mechanics");
		} else {
			res.redirect("/mechanics/" + req.params.id);
		}
	});
});

// SHOW
router.get("/mechanics/:id", function(req, res){
    Service.findById(req.params.id)
        .populate("author.id")
        .exec(function(err, service){
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                Service.find({})
                .populate("author.id")
                .exec(function(err, services){
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("services/show", {service: service, services: services});
                    }
                });
            }
        });
});

// DESTROY
router.delete("/mechanics/:id", isLoggedIn, checkServiceOwnership, function(req, res){
	Service.findByIdAndRemove(req.params.id, function(err, service){
		if (err) {
			res.redirect("/mechanics");
		} else {
			// Comment.deleteMany({_id: {$in: service.comments}}, function(err){
			// 	if (err) {
			// 		console.log(err);
			// 	}
			// 	res.redirect("/mechanics");
            // });
            res.redirect("/");
		}
	});
});

router.get("/acp", isLoggedIn, function(req, res){
    User.find({}, function(err, users){
        if (err) {
            console.log(err);
        } else {
            res.render("acp/index", {users: users});
        }
    })
});


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/user/login");
};

function checkServiceOwnership(req, res, next) {
    if (req.isAuthenticated()) {
		Service.findById(req.params.id, function(err, service){
			if (err || !service) {
				console.log(err);
				console.log("Service not found");
				res.redirect("back");
			} else {
				// Does user own the service?
				if (service.author.id.equals(req.user._id)) {
					next();
				} else {
					console.log("You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		console.log("You need to be logged in to do that.");
		res.redirect("back");
	}
}

module.exports = router;