const ChatModel = require("../models/chatModel");

exports.getChatByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const chat = await ChatModel.findOne({ team_id: teamId })
      .populate("messages.user", "username email")
      .populate("explainer", "username email");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found for this team" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("❌ Error fetching chat:", error);
    res.status(500).json({ message: "Server error while fetching chat" });
  }
};

exports.createChatForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const existingChat = await ChatModel.findOne({ team_id: teamId });
    if (existingChat) {
      return res.status(400).json({ message: "Chat for this team already exists" });
    }

    const chat = await ChatModel.create({ team_id: teamId, messages: [] });

    res.status(201).json({ message: "Chat created", chat });
  } catch (error) {
    console.error("❌ Error creating chat:", error);
    res.status(500).json({ message: "Server error while creating chat" });
  }
};
