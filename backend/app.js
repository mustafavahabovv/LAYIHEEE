import express from "express";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "./src/db/dbConnection.js";
import productRouter from "./src/routes/productRouter.js";
import userRouter from "./src/routes/userRouter.js";
import cookieParser from "cookie-parser";
import reviewRoutes from "./src/routes/reviewRouters.js";
import wishlistRouter from "./src/routes/wishlistRouter.js";
import supportRoutes from "./src/routes/supportRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// ✅ HTTP server və socket.io qurulması
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ✅ Middleware-lər
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use("/images", express.static("src/images"));

// ✅ ROUTES
app.use("/api/products", productRouter);
app.use("/auth", userRouter);
app.use("/api/user", userRouter);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/support", supportRoutes); // ✅ DÜZGÜN ROUTE PREFIX

// ✅ Socket.io hadisələri
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("sendMessage", (data) => {
    console.log(`New message from ${data.senderId}: ${data.content}`);
    io.emit("receiveMessage", {
      senderId: data.senderId,
      senderUsername: data.senderUsername,
      content: data.content,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// ✅ Root endpoint
app.get("/", (req, res) => {
  res.send("Hello World");
});

// ✅ Yalnız BİR DƏFƏ server başlat
server.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
