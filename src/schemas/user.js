const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    orders: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }]
})


module.exports = mongoose.model("User", userSchema)