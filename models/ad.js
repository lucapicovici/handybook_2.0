var mongoose = require("mongoose");

var adSchema = mongoose.Schema({
    adId: {type: mongoose.Schema.Types.ObjectId, ref: "Service"},
    expireAt: {
        type: Date,
        default: Date.now,
        index: {expires: "60000"}
    }
});

module.exports = mongoose.model("Ad", adSchema);