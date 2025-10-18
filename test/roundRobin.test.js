require("dotenv").config();
const mongoose = require("mongoose");
const Team = require("./../models/TeamModel");
const { getNextExplainer } = require("./../utils/teamRoundRobin");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
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
            player_list: [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
            ],
            currentExplainerIndex: -1,
        });
    });

    test("should rotate explainers correctly", async () => {
        const rounds = 6;

        for (let i = 0; i < rounds; i++) {
            const { nextIndex, nextPlayerId } = getNextExplainer(
                team.player_list,
                team.currentExplainerIndex
            );

            expect(nextPlayerId).toBeDefined();
            expect(typeof nextIndex).toBe("number");

            console.log(`Round ${i + 1}: Index = ${nextIndex}, Player ID = ${nextPlayerId.toString()}`);

            team.currentExplainer = nextPlayerId;
            team.currentExplainerIndex = nextIndex;

            await team.save();
        }

        expect(team.currentExplainerIndex).toBeLessThan(team.player_list.length);
        expect(team.currentExplainer).toEqual(team.player_list[team.currentExplainerIndex]);
    });
});
