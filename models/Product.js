const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    desc: {
        type: String,
        require: true
    },
    img: {
        type: String,
        require: true
    },
    categories: {
        type: Array,
        require: true
    },
    size: {
        type: Array
    },
    color: {
        type: Array
    },
    price: {
        type: Number,
        require: true
    },
    feature: {
        type: Boolean,
        default: false
    },
    inStock: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", ProductSchema);