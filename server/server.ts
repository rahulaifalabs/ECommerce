const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const commonFeatureRouter = require("./routes/common/feature-routes");
const uploadRoutes = require("./routes/uploads/upload");

const MongoDB_URI = require("./config/db");

// Normalize Mongo URI
const mongoUri =
  typeof MongoDB_URI === "string"
    ? MongoDB_URI
    : (MongoDB_URI && (MongoDB_URI.uri || MongoDB_URI.connectionString)) ||
      process.env.MONGO_URI;

if (!mongoUri || typeof mongoUri !== "string") {
  console.error("❌ MongoDB URI missing or invalid!");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routers
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

// ✅ Setup HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
  },
});

// Export io so controllers can use it
module.exports.io = io;
app.set("io", io);

// Socket.IO connection events
io.on("connection", (socket) => {
  console.log("⚡ Admin Dashboard connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Admin Dashboard disconnected:", socket.id);
  });
});

// ✅ Start server (only once!)
server.listen(PORT, () =>
  console.log(`✅ Server & Socket.IO running at http://localhost:${PORT}`)
);
