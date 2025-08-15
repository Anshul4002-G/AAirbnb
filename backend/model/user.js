const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String },
    email: { type: String, required: [true, 'email is req'] },
    password: { type: String, required: true },
    usertype: { type: String, enum: ['guest', 'host'] },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'home' }],
    booked:[{type: mongoose.Schema.Types.ObjectId , ref:'home'}],
});

module.exports = mongoose.model('user', userSchema);