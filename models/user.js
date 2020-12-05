var mongoose = require("mongoose"),
    bcrypt   = require("bcrypt-nodejs");

var userSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    rating: {type: Number},
    username: {type: String},
    name: {type: String},
    phone: {type: String},
    profession: {type: String},
    skills: {type: String},
    photo: {type: String, default: "https://images.unsplash.com/photo-1605559141066-1549783d18e9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"}
});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User", userSchema);