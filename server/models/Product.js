const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
        default: 0
    },
    image: {
        type: String, // Yahan hum image ka URL ya file path store karenge
        required: [true, 'Please add an image URL']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    countInStock: {
        type: Number,
        required: [true, 'Please add stock count'],
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);