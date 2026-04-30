require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Cake = require("./models/Cake");
const Cart = require("./models/Cart");
const auth = require("./middleware/auth.js");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 12);
  const user = new User({
    email: req.body.email,
    password: hashed,
    role: req.body.role,
  });
  await user.save();
  res.json({ message: "User created" });
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).json({ message: "Wrong password" });

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
  });
  res.json({ accessToken });
});

app.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const verified = jwt.verify(token, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign(
      { id: verified.id, role: verified.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

app.get("/cakes", async (req, res) => {
  const cakes = await Cake.find();
  res.json(cakes);
});

app.get("/cart", auth, async (req, res) => {
  const cartItems = await Cart.find({ userId: req.user.id });
  res.json(cartItems);
});

app.post("/cart", auth, async (req, res) => {
  const cartItem = new Cart({
    userId: req.user.id,
    cake: {
      _id: cake._id,
      name: cake.name,
      quantity: cake.quantity,
      price: cake.price,
    },
  });
  await cartItem.save();
  res.json(cartItem);
});

app.put("/cart/:id", auth, async (req, res) => {
  const updated = await Cart.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: { "cake.quantity": quantity } },
    { new: true },
  );
  res.json(updated);
});

app.delete("/cart/:id", auth, async (req, res) => {
  await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
