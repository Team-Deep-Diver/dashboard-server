const ERROR = {
  NO_NICKNAME: "* 닉네임을 입력해 주세요.",
  NO_EMAIL: "* 이메일을 입력해 주세요.",
  NO_PASSWORD: "* 비밀번호를 입력해 주세요.",
  NO_MESSAGE: "* 메시지를 입력해 주세요.",
  INVALID_EMAIL_FORMAT: "* 이메일 형식에 맞지 않습니다.",
  INVALID_PASSWORD_LENGTH: "* 비밀번호는 최소 8자 이상이어야 합니다.",
  INVALID_PASSWORD_FORMAT:
    "* 비밀번호는 한 개 이상의 숫자와 영문자를 포함해야 합니다.",
  INVALID_ACCOUNT: "* 해당 이메일을 가진 계정이 존재하지 않습니다.",
  PASSWORDS_NOT_MATCH: "* 비밀번호가 일치하지 않습니다.",
  EMAIL_DUPLICATE: "* 중복된 이메일 주소입니다.",
  GROUP_NAME_DUPLICATE: "* 사용 불가능한 그룹명입니다.",
  GROUP_APPLICATION_DUPLICATE: "* 이미 신청한 그룹입니다.",
  USER_NOT_FOUND: "* 가입되지 않은 사용자입니다.",
  GROUP_NOT_FOUND: "* 해당 그룹을 찾을 수 없습니다.",
  MEMBER_NOT_FOUND: "* 멤버를 찾을 수 없습니다.",
  AUTH_FORBIDDEN: "* 인증 오류가 발생했습니다. 다시 시도해주세요.",
  SERVER_ERROR: "* 오류가 발생했습니다. 다시 시도해주세요.",
};

module.exports = ERROR;
