import SupportMessage from "../models/SupportMessage.js";

export const sendSupport = async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const image = req.file ? req.file.filename : null;

    const message = new SupportMessage({
      title,
      description,
      author,
      image,
      status: "pending", // ✳️ MÜTLƏQ BU OLMALIDIR ✳️
    });

    await message.save();

    res.status(201).json({ message: "Support message sent", data: message });
  } catch (error) {
    console.error("❌ Error sending support message:", error);
    res.status(500).json({ message: "Failed to send support message" });
  }
};

export const getUserSupportMessages = async (req, res) => {
  try {
    const { username } = req.params;
    const messages = await SupportMessage.find({ author: username }).sort({
      createdAt: -1,
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching user support messages:", error);
    res.status(500).json({ message: "Failed to fetch user support messages." });
  }
};


export const getRepliedSupportMessages = async (req, res) => {
  try {
    const userId = req.params.id;

    const repliedMessages = await SupportMessage.find({
      status: "replied",
      author: userId,
    }).sort({ updatedAt: -1 });

    res.status(200).json(repliedMessages);
  } catch (error) {
    console.error("Error fetching replied messages:", error);
    res.status(500).json({ message: "Failed to get replied messages." });
  }
};


export const replySupportMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const message = await SupportMessage.findByIdAndUpdate(
      id,
      {
        adminReply: reply,
        status: "replied", // ✅ cavablanıb kimi işarələ
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json({ message: "Reply sent successfully", data: message });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reply" });
  }
};


export const getPendingSupportMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find({ status: "pending" }).sort({
      createdAt: -1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending messages" });
  }
};


