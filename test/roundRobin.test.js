require("dotenv").config();
const mongoose = require("mongoose");
const Team = require("../models");
const { getNextExplainer } = require("../utils");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Round Robin simulation", () => {
  let team;

  beforeEach(async () => {
    await Team.deleteMany({ name: "Test Team" });

    team = await Team.create({
      name: "Test Team",
      player_list: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
      currentExplainerIndex: -1,
    });
  });

  test("should rotate explainers correctly", async () => {
    const rounds = 6;

    for (let i = 0; i < rounds; i++) {
      const { nextIndex, nextExplainer } = getNextExplainer(team.player_list, team.currentExplainerIndex);

      expect(nextExplainer).toBeDefined();
      expect(typeof nextIndex).toBe("number");

      console.log(`Round ${i + 1}: Index = ${nextIndex}, Player ID = ${nextExplainer._id?.toString() || nextExplainer.toString()}`);

      team.currentExplainer = nextExplainer._id || nextExplainer;
      team.currentExplainerIndex = nextIndex;

      await team.save();
    }

    expect(team.currentExplainerIndex).toBeLessThan(team.player_list.length);
    expect(team.currentExplainer.toString()).toEqual(team.player_list[team.currentExplainerIndex].toString());
  });
});
