const mongoose = require("mongoose");
const cartschema = new mongoose.Schema({
     products: [{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
     }
    ]
});

const CartModel = mongoose.model("Cart", cartschema);
module.exports = CartModel;