import express from "express";
import multer from "multer";
import { sendSupport } from "../controllers/supportController.js";
import { replySupportMessage } from "../controllers/supportController.js";
import { getPendingSupportMessages } from "../controllers/supportController.js";
import { getRepliedSupportMessages } from "../controllers/supportController.js";
import SupportMessage from "../models/SupportMessage.js";
import { getUserSupportMessages } from "../controllers/supportController.js";

const router = express.Router();

// 🔹 Multer image yükləmə
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/support"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Cavabsız support mesajlarını gətir
// supportRoutes.js içində `/pending` route düzəlt:
router.get("/pending", async (req, res) => {
    try {
        const messages = await SupportMessage.find({ status: "pending" }).sort({
            createdAt: -1,
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending messages" });
    }
});


router.get("/user/:username", getUserSupportMessages);
router.get("/user/:username", async (req, res) => {
  try {
    const messages = await SupportMessage.find({
      author: req.params.username,
      status: "replied", // Yalnız cavablanmışları çək
    }).sort({ updatedAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get replied support messages" });
  }
});


router.post("/send", upload.single("image"), sendSupport);
// PUT /support/reply/:id
router.put("/reply/:id", replySupportMessage);
// Bütün support mesajlarını gətir (Admin üçün)
router.get("/", async (req, res) => {
    try {
        const allMessages = await SupportMessage.find().sort({ createdAt: -1 });
        res.status(200).json(allMessages);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch support messages" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await SupportMessage.findByIdAndDelete(id);
        res.status(200).json({ message: "Support message deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete support message" });
    }
});


export default router;
