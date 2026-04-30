const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      items: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, required: true },
          name: { type: String, required: true },
          price: { type: String, required: true },
          quantity: { type: Number, required: true },
        },
      ],
    },
    { timestamps: true },
  ),
);
