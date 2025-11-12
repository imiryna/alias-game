const mongoose = require("mongoose");
const { getNextExplainer } = require("../utils");

describe("Round Robin simulation with mocks", () => {
  let team;

  beforeEach(() => {
    team = {
      name: "Test Team",
      player_list: [
        { _id: new mongoose.Types.ObjectId() },
        { _id: new mongoose.Types.ObjectId() },
        { _id: new mongoose.Types.ObjectId() },
      ],
      currentExplainerIndex: -1,
      currentExplainer: null,
      save: jest.fn().mockResolvedValue(true),
    };
  });

  test("should rotate explainers correctly", async () => {
    const rounds = 6;

    for (let i = 0; i < rounds; i++) {
      const nextExplainer = getNextExplainer(
        team.player_list,
        team.currentExplainer
      );

      expect(nextExplainer).toBeDefined();

      team.currentExplainer = nextExplainer; // сохраняем объект целиком
      team.currentExplainerIndex = team.player_list.indexOf(nextExplainer);

      await team.save();
    }

    expect(team.currentExplainerIndex).toBeLessThan(team.player_list.length);
    expect(team.currentExplainer._id.toString()).toEqual(
      team.player_list[team.currentExplainerIndex]._id.toString()
    );
    expect(team.save).toHaveBeenCalledTimes(rounds);
  });
});
