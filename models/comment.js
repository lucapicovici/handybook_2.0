var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	text: {type: String, required: true},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: {type: String, required: true}
	}
});

module.exports = mongoose.model("Comment", commentSchema);