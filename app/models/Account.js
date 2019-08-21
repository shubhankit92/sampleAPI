var mongoose = require('mongoose');

module.exports = mongoose.model('Account', {
	_id: String,
	email: { type: String, required: true, unique: true }
});