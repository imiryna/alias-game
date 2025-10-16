const TeamModel = require("../models/teamModel");

exports.createTeam = async (req, res) => {
  try {
    const { name, player_list } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const newTeam = await TeamModel.create({
      name,
      player_list: player_list || [],
    });

    res.status(201).json({
      message: "Team created successfully",
      team: newTeam,
    });
  } catch (error) {
    console.error("❌ Error creating team:", error);
    res.status(500).json({ message: "Server error while creating team" });
  }
};


exports.getAllTeams = async (_req, res) => {
  try {
    const teams = await TeamModel.find().populate("player_list", "username email");
    res.status(200).json(teams);
  } catch (error) {
    console.error("❌ Error fetching teams:", error);
    res.status(500).json({ message: "Server error while fetching teams" });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await TeamModel.findById(id).populate("player_list", "username email");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error("❌ Error fetching team:", error);
    res.status(500).json({ message: "Server error while fetching team" });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 

    const updatedTeam = await TeamModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("player_list", "username email");

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("❌ Error updating team:", error);
    res.status(500).json({ message: "Server error while updating team" });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeam = await TeamModel.findByIdAndDelete(id);

    if (!deletedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      message: "Team deleted successfully",
      team: deletedTeam,
    });
  } catch (error) {
    console.error("❌ Error deleting team:", error);
    res.status(500).json({ message: "Server error while deleting team" });
  }
};
