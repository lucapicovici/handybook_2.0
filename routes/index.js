var express  = require("express"),
    mongoose = require("mongoose"),
    router   = express.Router();

var Service  = require("../models/service.js"),
    User     = require("../models/user.js"),
    Category = require("../models/category.js"),
    County   = require("../models/county.js");

router.get("/", function(req, res){
    // Category.create({
    //     category: "Cars"
    // });
    // County.create({
    //     county: "Alba"
    // });


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
    .populate("author.id category county")
    .exec(function(err, services){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {services: services});
        }
    });
});

// NEW
router.get("/services/new", isLoggedIn, function(req, res){
    res.render("services/new");
});

// CATEGORIES
router.get("/services/categories", function(req, res){
    res.render("services/categories");
});

// CATEGORIES index
router.get("/services/categories/index", function(req, res){
    Service.find({})
    .populate("author.id category county")
    .exec(function(err, services){
        if (err) {
            console.log(err);
        } else {
            res.render("services/index", {services: services});
        }
    });
});

// CREATE
router.post("/services", isLoggedIn, async function(req, res){
    try {
        var formData = req.body.service;
        var tempCategoryId = "", tempCountyId = "";
        var category = await Category.findOne({category: formData.category});
        tempCategoryId = category._id;
        console.log(`tempCategoryId is ${tempCategoryId}`);

        var county = await County.findOne({county: formData.county});
        tempCountyId = county._id;
        console.log(`tempCountyId is ${tempCountyId}`);

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
            ],
            category: tempCategoryId,
            county: tempCountyId
        };
    
        var service = await Service.create(newService);
        console.log(`Created ${service}`);
        return res.redirect("/");
    } catch(err) {
        console.log(err);
    }


    // var p = new Promise(function(resolve){
    //     Category.findOne({category: formData.category}, function(err, category){
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             tempCategoryId = category._id;
    //             console.log(`typeof category is ${typeof category}`);
    //             console.log("***found " + category);
    //             console.log("***tempCategoryId is " + tempCategoryId);
    //             resolve();
    //         }
    //     });
    // });
    // p.then(function(){
    //     return new Promise(function(resolve){
    //         County.findOne({county: formData.county}, function(err, county){
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 tempCountyId = county._id;
    //                 console.log("***found " + county);
    //                 console.log("***tempCountyId is " + tempCountyId);
    //                 resolve();
    //             }
    //         })
    //     });
    // }).then(function(){
    //     var newService = {
    //         author: {
    //             id: req.user._id,
    //             name: formData.author
    //         },
    //         title: formData.title,
    //         about: formData.about,
    //         hourlyRate: formData.hourlyRate,
    //         photos: [
    //             {src: formData.photo}
    //         ],
    //         category: tempCategoryId,
    //         county: tempCountyId
    //     };
    
    //     Service.create(newService, function(err, service){
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log("CREATED " + service.title);
    //             res.redirect("/");
    //         }
    //     })
    // })
});

// EDIT
router.get("/services/:id/edit", isLoggedIn, checkServiceOwnership, function(req, res){
    Service.findById(req.params.id).populate("category county")
        .exec(function(err, service){
            if (err) {
                console.log(err);
            } else {
                res.render("services/edit", {service: service});
            }
        });
});

// UPDATE
router.put("/services/:id", isLoggedIn, checkServiceOwnership, function(req, res){
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
			res.redirect("/");
		} else {
			res.redirect("/services/" + req.params.id);
		}
	});
});

// SHOW
router.get("/services/:id", function(req, res){
    Service.findById(req.params.id)
        .populate("author.id category county")
        .exec(function(err, service){
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                Service.find({})
                .populate("author.id category county")
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
router.delete("/services/:id", isLoggedIn, checkServiceOwnership, function(req, res){
	Service.findByIdAndRemove(req.params.id, function(err, service){
		if (err) {
			res.redirect("/services");
		} else {
			// Comment.deleteMany({_id: {$in: service.comments}}, function(err){
			// 	if (err) {
			// 		console.log(err);
			// 	}
			// 	res.redirect("/services");
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