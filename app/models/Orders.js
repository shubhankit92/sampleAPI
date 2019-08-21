var mongoose = require('mongoose');

module.exports = mongoose.model('Orders', {
	accountId: Number,
	list : { type : Array , default : [] }
});