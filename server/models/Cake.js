const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Cake",
  new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
  }),
);
