var mongoose = require("mongoose");

var categorySchema = mongoose.Schema({
    category: {type: String, required: true, unique: true, dropDups: true}
});

module.exports = mongoose.model("Category", categorySchema);