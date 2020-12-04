var passport      = require("passport"),
    User          = require("../models/user.js"),
    localStrategy = require("passport-local");

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if (err) {
            console.log(err);
        } else {
            done(err, user);
        }
    });
});

passport.use("local.signup", new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email");
    req.checkBody("password").notEmpty().withMessage("Password is required").isLength({min: 8, max: 16}).withMessage("Password must be between 8 to 16 characters");
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash("error", messages));
    }
    User.findOne({"email": email}, function(err, foundUser){
        if (err) {
            return done(err);
        }
        // Return (flash) message if the user already exists, 
        // so you don't overwrite or create a new one with same email
        if (foundUser) {
            return done(null, false, {message: "Email is already in use."});
        }
        // Create new user
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        newUser.save(function(err, user){
            if (err) {
                return done(err);
            }
            return done(null, user);
        });
    });
}));

passport.use("local.signin", new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, function(req, email, password, done){
    req.checkBody("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email");
    req.checkBody("password").notEmpty().withMessage("Password is required").isLength({min: 8, max: 16}).withMessage("Password must be between 8 to 16 characters");
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash("error", messages));
    }
    User.findOne({"email": email}, function(err, foundUser){
        if (err) {
            return done(err);
        }
        // Return (flash) message if the user already exists, 
        // so you don't overwrite or create a new one with same email
        if (!foundUser) {
            return done(null, false, {message: "No user found."});
        }
        if (!foundUser.validPassword(password)) {
            return done(null, false, {message: "Wrong password"});
        }
        return done(null, foundUser);
    });
}));