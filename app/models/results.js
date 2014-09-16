var mongoose = require('mongoose');

module.exports = mongoose.model('Result', {
	date:{ type: String },
	calculatorData: {type: Array},
	emailAddress: {type: String}	
	
});