const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
    maxlength: 30
	},
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Object,
    required: true,
  },
  likes: [{
    default: {
      type: Object,
    }
  }],
  createdAt: {
    type: Date,
    enum: Date.now
  },
});

module.exports = mongoose.model('card', cardSchema);