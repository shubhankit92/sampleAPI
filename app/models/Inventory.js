var mongoose = require('mongoose');

module.exports = mongoose.model('Inventory', {
	_id: mongoose.Schema.Types.ObjectId,
	name : {type : String, default: ''},
	description : {type : String, default: ''},
	quantity: Number
});