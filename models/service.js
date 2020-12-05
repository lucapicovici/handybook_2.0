var mongoose = require("mongoose");

var serviceSchema = mongoose.Schema({
    author: {
        id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        name: {type: String, required: true}
    },
    title: {type: String, required: true},
    about: {type: String, required: true},
    hourlyRate: {type: String},
    rating: {type: Number, min: 0, max: 5},
    comments: [
        {type: mongoose.Schema.Types.ObjectId, ref: "Comment"}
    ],
    photos: [
        {src: {type: String, required: true}}
    ],
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    county: {type: mongoose.Schema.Types.ObjectId, ref: "County"}
});

module.exports = mongoose.model("Service", serviceSchema);