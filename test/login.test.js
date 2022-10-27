const jwt = require("jsonwebtoken"); // test 코드에 직접 import
// jwt 패키지의 기본 메서드 결과물도 mocking이 가능
jest.mock("jsonwebtoken", () => {
  return {
    sign: jest.fn(() => "TOKEN"),
    verify: jest.fn(() => "verify"),
  };
});
describe("login", () => {
  it("should return a signed token", () => {
    const EMAIL = "test@gmail.com";
    const token = jwt.sign({ email: EMAIL });
    // jwt.sign이 1번 실행되고, 들어가는 인자만 테스트하는 코드.
    // 결과값은 mocking하였음
    expect(jwt.sign).toHaveBeenCalledTimes(1);
    // expect(jwt.sign).toHaveBeenCalledWith(
    //   { email: EMAIL },
    //   process.env.JWT_SECRET
    // );
    expect(token).toBe("TOKEN");
  });
});
