var express        = require("express"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    bodyParser     = require("body-parser"),
    flash          = require("connect-flash"),
    validator      = require("express-validator"),
    session        = require("express-session"),
    methodOverride = require('method-override'),
    app            = express();

var indexRoutes = require("./routes/index.js"),
    userRoutes  = require("./routes/user.js");
require("./config/passport.js");

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
var dbUrl = process.env.DATABASEURL || "mongodb://localhost/handybook";
mongoose.connect(dbUrl);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(session({
    secret: "This app functionality is really cool so far",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator()); // After bodyParser
app.use(flash());
app.use(methodOverride("_method"));

app.use(function(req, res, next){
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    res.locals.profileId = req.url.substring(14);
    next();
});

app.use("/user", userRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log("HandyBook server is now listening to port 3000.");
});