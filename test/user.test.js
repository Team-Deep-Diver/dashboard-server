const httpMocks = require("node-mocks-http");

// const userController = require("../../routes/controllers/userController"); //삭제 예정
const User = require("../models/User");
// const user = require("../__mocks__/new_user.json");
const jwt = require("jsonwebtoken");
const { request } = require("express");
const Group = require("../models/Group");

jest.mock("jsonwebtoken", () => {
  return {
    sign: jest.fn(() => "TOKEN"),
    verify: jest.fn(() => "verify"),
  };
});

let req, res, next;

beforeEach(() => {
  User.findOne = jest.fn();
  User.findById = jest.fn();
  User.create = jest.fn();
  Group.findOne = jest.fn();

  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

afterEach(() => {
  User.findOne.mockClear();
  User.findById.mockClear();
  User.create.mockClear();
  Group.findOne.mockClear();
});

describe("AuthenticateUser", () => {
  beforeEach(() => {
    req = {
      user: {
        _id: "okok",
        email: "test@gmail.com",
        role: "ADMIN",
      },
      headers: {
        Authorization: "TOKEN",
      },
    };
    res = {
      status: jest.fn(() => res),
    };
  });

  afterEach(() => {
    User.findOne.mockClear();
    User.create.mockClear();
  });

  it("user가 유효하고, 어드민이라면", async () => {
    if (
      jwt.verify(req.headers.Authorization) === "verify" &&
      req.user.role === "ADMIN"
    ) {
      console.log(">>>>>>>>");
      await User.findOne({ _id: req.user._id });
      await Group.findOne({ admin: req.user._id });
      res.status(200);
    }

    expect(Group.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBeCalledWith(200);
  });

  it("Don't call User.findById when user가 유효하지 않다면", async () => {
    const user = {
      _id: "1234",
      email: "wrongUser@gmail.com",
      headers: {
        Authorization: "wrongToken",
      },
    };
    jwt.verify.mockReturnValue(user.headers.Authorization);

    if (jwt.verify(req.headers.Authorization) === "verify") {
      User.findById(req.user._id);
    }

    expect(User.findById).not.toBeCalled();
  });
});
