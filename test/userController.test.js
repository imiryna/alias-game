const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const {
  getUserById,
  getAllUsers,
  deleteUser,
  signup,
  login,
  refresh,
} = require("../services");
const {StatusCodes} = require("http-status-codes");

jest.mock("../services");

describe("User + Auth Controllers (unit tests)", () => {
  let mockUser;
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = {id: "1", name: "Test User", email: "test@test.com", password: "hashed"};

    req = {body: {}, params: {}};
    res = {status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis()};
    next = jest.fn();
  });

  // ----- AuthController -----
  test("signup should create a user", async () => {
    signup.mockResolvedValue(mockUser);
    req.body = {name: "Test User", email: "test@test.com", password: "123456"};

    await authController.signup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith({message: "Success", user: mockUser});
  });

  test("login should return user", async () => {
    login.mockResolvedValue(mockUser);
    req.body = {email: "test@test.com", password: "123456"};

    await authController.login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith({message: "Success", user: mockUser});
  });

  test("refresh should return tokens", async () => {
    const tokens = {accessToken: "newAccess", refreshToken: "newRefresh"};
    refresh.mockResolvedValue(tokens);
    req.body = {token: "oldRefresh"};

    await authController.refresh(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token refreshed",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  });

  // ----- UserController -----
  test("getAllUsers should return users without passwords", async () => {
    getAllUsers.mockResolvedValue([mockUser]);

    await userController.getAllUsers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith([{...mockUser, password: undefined}]);
  });


  test("getUserById should return user without password", async () => {
    getUserById.mockResolvedValue(mockUser);
    req.params.id = "1";

    await userController.getUserById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({...mockUser, password: undefined});
  });

  test("deleteUser should return success if user found", async () => {
    deleteUser.mockResolvedValue(mockUser);
    req.params.id = "1";

    await userController.deleteUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({message: "Success"});
  });
});
