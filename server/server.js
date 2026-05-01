require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
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
const Order = require("./models/Order");
const auth = require("./middleware/auth.js");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5001, () => console.log("Server running on port 5001"));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 12);
  const user = new User({
    email: req.body.email,
    password: hashed,
    role: req.body.role,
  });
  await user.save();
  res.json({ message: "Account is created" });
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

  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
  });
  res.json({ role: user.role });
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

app.get("/auth", auth, (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
});

app.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    path: "/",
    sameSite: isProduction ? "none" : "strict",
    secure: isProduction,
  };
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
  res.json({ message: "Logged out" });
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
  const cartItem = await Cart.findOneAndUpdate(
    // find an existing cart item for this user and cake
    { userId: req.user.id, "cake._id": req.body.cake._id },
    {
      // increment quantity by 1 if found, or start at 1 if inserting
      $inc: { "cake.quantity": 1 },
      // set name and price only when inserting a new document
      $setOnInsert: {
        "cake.name": req.body.cake.name,
        "cake.price": req.body.cake.price,
      },
    },
    { upsert: true, new: true },
  );
  res.json(cartItem);
});

app.delete("/cart/:id", auth, async (req, res) => {
  await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ message: "Deleted" });
});

app.get("/orders", async (req, res) => {
  // show most recent orders first
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

app.post("/orders", auth, async (req, res) => {
  // fetch all cart items for the user
  const cartItems = await Cart.find({ userId: req.user.id });

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // save cart items as a new order
  const order = new Order({
    userId: req.user.id,
    items: cartItems.map((item) => item.cake),
  });
  await order.save();

  // clear the user's cart after placing the order
  await Cart.deleteMany({ userId: req.user.id });

  res.json(order);
});
