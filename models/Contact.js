const mongoose = require("mongoose");


const ContactSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    phone: {
        type: String,
        require: true,
        max: 10
    },
    message: {
        type: String,
        require: true
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Contact", ContactSchema);