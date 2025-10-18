require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/UserModel");
const Team = require("../models/TeamModel");
const { chooseNextExplainer } = require("../services/teamService");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe("chooseNextExplainer service", () => {
    let users;
    let team;

    beforeEach(async () => {
        await User.deleteMany({});
        await Team.deleteMany({});

        users = await User.create([
            { name: "User 1", email: "user1@test.com", password: "123456" },
            { name: "User 2", email: "user2@test.com", password: "123456" },
            { name: "User 3", email: "user3@test.com", password: "123456" },
        ]);

        team = await Team.create({
            name: "Test Team",
            player_list: users.map((u) => u._id),
            currentExplainerIndex: -1,
        });

        team = await Team.findById(team._id).populate("player_list");
    });

    test("should correctly rotate explainers in round-robin order", async () => {
        const expectedOrder = users.map((u) => u.name);
        const seenOrder = [];

        for (let i = 0; i < 6; i++) {
            const updatedTeam = await chooseNextExplainer(team._id);
            const populated = await Team.findById(updatedTeam._id).populate("currentExplainer");

            expect(populated.currentExplainer).toBeDefined();
            seenOrder.push(populated.currentExplainer.name);

            console.log(`Round ${i + 1}: ${populated.currentExplainer.name}`);
        }

        expect(seenOrder.slice(0, 3)).toEqual(expectedOrder);
        expect(seenOrder.slice(3, 6)).toEqual(expectedOrder);
    });
});
