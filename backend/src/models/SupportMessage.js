import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String },
  adminReply: { type: String, default: "" }, // 💬 adminin cavabı
  status: { type: String, enum: ["pending", "replied"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("SupportMessage", supportMessageSchema);
