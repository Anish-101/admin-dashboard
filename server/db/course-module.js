const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    imageLink: { type: String },
    isPublished: { type: Boolean }
})

module.exports = mongoose.model('Course', courseSchema);