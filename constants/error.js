const ERROR = {
  NO_NICKNAME: "Nickname is required.",
  NO_EMAIL: "Email is required.",
  NO_PASSWORD: "Password is required.",
  NO_MESSAGE: "Message is required.",
  NO_CONTENT: "Content is required.",
  INVALID_EMAIL_FORMAT: "Invalid email address format.",
  INVALID_PASSWORD_LENGTH: "Password must be at least 8 chars long.",
  INVALID_PASSWORD_FORMAT: "Password must contain at least one letter and one number.",
  INVALID_ACCOUNT: "An account with this email does not exist.",
  PASSWORDS_NOT_MATCH: "Passwords do not match.",
  WRONG_PASSWORD: "Email and password do not match.",
  EMAIL_DUPLICATE: "This email is already taken.",
  GROUP_NAME_DUPLICATE: "This group name is alreday taken.",
  GROUP_APPLICATION_DUPLICATE: "This group has already been applied.",
  CARD_NOT_FOUND: "Card not found.",
  USER_NOT_FOUND: "User not found.",
  GROUP_NOT_FOUND: "Group not found.",
  MEMBER_NOT_FOUND: "Member not found.",
  AUTH_FORBIDDEN: "Authentication error.",
  SERVER_ERROR: "Internal server error.",
};

module.exports = ERROR;
