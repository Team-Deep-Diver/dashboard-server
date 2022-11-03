const ERROR = {
  NO_NICKNAME: "* 닉네임을 입력해 주세요.",
  NO_EMAIL: "* 이메일을 입력해 주세요.",
  NO_PASSWORD: "* 비밀번호를 입력해 주세요.",
  NO_MESSAGE: "* 메시지를 입력해 주세요.",
  NO_CONTENT: "Content is required.",
  INVALID_EMAIL_FORMAT: "* 이메일 형식에 맞지 않습니다.",
  INVALID_PASSWORD_LENGTH: "* 비밀번호는 최소 8자 이상이어야 합니다.",
  INVALID_PASSWORD_FORMAT:
    "* 비밀번호는 한 개 이상의 숫자와 영문자를 포함해야 합니다.",
  INVALID_ACCOUNT: "* 해당 이메일을 가진 계정이 존재하지 않습니다.",
  PASSWORDS_NOT_MATCH: "* 비밀번호가 일치하지 않습니다.",
  EMAIL_DUPLICATE: "This email is already taken.",
  GROUP_NAME_DUPLICATE: "This group name is alreday taken.",
  GROUP_APPLICATION_DUPLICATE: "This group has already been applied.",
  CARD_NOT_FOUND: "Card not found.",
  USER_NOT_FOUND: "* 가입되지 않은 이메일입니다.",
  GROUP_NOT_FOUND: "* 해당 그룹을 찾을 수 없습니다.",
  MEMBER_NOT_FOUND: "Member not found.",
  AUTH_FORBIDDEN: "Authentication error.",
  SERVER_ERROR: "Internal server error.",
};

module.exports = ERROR;
