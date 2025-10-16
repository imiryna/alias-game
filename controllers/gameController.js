const GameModel = require("../models/gameModel");

exports.createGame = async (req, res) => {
  try {
    const { name, settings, word_vocabulary } = req.body;
    const admin = req.user._id;
    if (!name) {
      return res.status(400).json({ message: "Game name is required" });
    }

    const newGame = await GameModel.create({
      name,
      admin,
      settings: settings || {},
      word_vocabulary: word_vocabulary || [],
    });

    res.status(201).json({
      message: "Game created successfully",
      game: newGame,
    });
  } catch (error) {
    console.error("❌ Error creating game:", error);
    res.status(500).json({ message: "Server error while creating game" });
  }
};


exports.getAllGames = async (_req, res) => {
  try {
    const games = await GameModel.find()
      .populate("admin", "username email")
      .populate("teams", "name team_score player_list");

    res.status(200).json(games);
  } catch (error) {
    console.error("❌ Error fetching games:", error);
    res.status(500).json({ message: "Server error while fetching games" });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await GameModel.findById(id)
      .populate("admin", "username email")
      .populate("teams", "name team_score player_list");

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("❌ Error fetching game:", error);
    res.status(500).json({ message: "Server error while fetching game" });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedGame = await GameModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("admin", "username email")
      .populate("teams", "name team_score player_list");

    if (!updatedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({
      message: "Game updated successfully",
      game: updatedGame,
    });
  } catch (error) {
    console.error("❌ Error updating game:", error);
    res.status(500).json({ message: "Server error while updating game" });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await GameModel.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.status(200).json({
      message: "Game deleted successfully",
      game: deletedGame,
    });
  } catch (error) {
    console.error("❌ Error deleting game:", error);
    res.status(500).json({ message: "Server error while deleting game" });
  }
};
