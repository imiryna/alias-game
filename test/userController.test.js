// const { StatusCodes } = require("http-status-codes");
// const { updatedUserStats, receiveUserStats } = require("../controllers");
// // const {increaseUserStats, getUserStats} = require('../services');

// jest.mock("../services/userService");

// describe("User Stats", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("updatedUserStats", () => {
//     it("should return updated stats if user exists", async () => {
//       const mockStats = { gamesPlayed: 1, wins: 0 };
//       increaseUserStats.mockResolvedValue(mockStats);

//       const req = { params: { id: "123" }, body: { gamesPlayed: 1, wins: 0 } };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
//       const next = jest.fn();

//       await updatedUserStats(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "User stats updated successfully",
//         stats: mockStats,
//       });
//       expect(next).not.toHaveBeenCalled();
//     });
//   });

//   describe("receiveUserStats", () => {
//     it("should return stats if user exists", async () => {
//       const mockStats = { stat: 5 };
//       getUserStats.mockResolvedValue(mockStats);

//       const req = { params: { id: "123" } };
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };
//       const next = jest.fn();

//       await receiveUserStats(req, res, next);

//       expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
//       expect(res.json).toHaveBeenCalledWith({
//         message: "User stats retrieved successfully",
//         stats: mockStats,
//       });
//       expect(next).not.toHaveBeenCalled();
//     });
//   });
// });
