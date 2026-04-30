const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Cart",
  new mongoose.Schema({
    username: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cake: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      price: { type: String, required: true },
      quantity: { type: String, required: true },
    },
  }),
);
