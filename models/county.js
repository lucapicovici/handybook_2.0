var mongoose = require("mongoose");

var countySchema = mongoose.Schema({
    county: {type: String, required: true, unique: true, dropDups: true}
});

module.exports = mongoose.model("County", countySchema);