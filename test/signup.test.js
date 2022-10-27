// // - Signup
// //     - validationCheck 함수를 호출한다.
// //     - 유저가 존재하지 않는다면 User.create() 함수를 호출한다.
// //     - 유저가 ADMIN 으로 가입한다면 Group.create() 함수를 호출한다.
// //     - 성공시 201 statusCode

// const request = require("supertest");

// const app = require("../app");
// const ERROR = require("../constants/error");

// describe("POST /signup", () => {//버전1
//   it("should fail when email is already in use", async () => {
//     await request(app)
//       .post("/signup/check-email")
//       .send({ email: "test@gmail.com" })
//       .expect(400)
//   });

// describe("POST /signup", () => {//버전2
//   it("should fail when email is already in use", async (done) => {
//     await request(app)
//       .post("/signup/check-email")
//       .send({ email: "test@gmail.com" })
//       .expect(400)
// .end((err, res) => {
//   if (e(rr) {
//     return done(err);
//   }
//   expect(res.text).toContain(ERROR.EMAIL_DUPLICATE); //error: ??
//   done); //콜백 뒤, 맨 마지막에 호출하면 비동기 코드 실행한다고 jest한테 알려줌
//       });
//   });

//   it("should fail when group-name is already in use", async (done) => {
//     await request(app)
//       .post("/signup/check-group-name")
//       .send({ groupName: "test" })
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//         expect(res.test).toContain(ERROR.GROUP_NAME_DUPLICATE);
//         done();
//       });
//   });

//   it("proceed successfully when all requirements are met", async () => {
//     await request(app)
//       .post("/signup")
//       .send({
//         nickname: "test",
//         email: "test11@gmail.com",
//         password: "test11test",
//         confirmPassword: "test11test",
//         role: "MEMBER",
//       })
//       .expect(201);
//   });
// });

const httpMocks = require("node-mocks-http");

const signupController = require("../routes/controllers/signupController");
const User = require("../models/User");
const newUser = require("./__mocks__/new_user.json");

let req, res, next;

beforeEach(() => {
  User.findOne = jest.fn();
  User.create = jest.fn();

  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

afterEach(() => {
  User.findOne.mockClear();
  User.create.mockClear();
});

describe.skip("POST /signup", () => {
  beforeEach(() => {
    req = {
      email: "test@gmail.com",
    };
    res = {
      status: jest.fn(() => res),
      redirect: jest.fn(),
    };
  });

  afterEach(() => {
    User.findOne.mockClear();
    User.create.mockClear();
  });

  it("Call check email duplicate when email has been registered", async () => {
    const email = { email: "test@gmail.com" };

    User.findOnd.mockReturnValue(email);

    await signupController.checkEmailDuplicate(req, res, next);

    expect(typeof signupController.checkEmailDuplicate).toBe("function");
  });
});
