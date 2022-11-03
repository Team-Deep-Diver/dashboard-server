const express = require("express");
const router = express.Router();

const {
  getUserInfo,
  getGroupInfo,
  withdrawGroup,
  applyGroup,
  updateApplicantStatus,
  getGroupNotice,
} = require("./controllers/usersController");

router.get("/:user_id", getUserInfo);

router.get("/:user_id/groups", getGroupInfo);

router
  .route("/:user_id/groups/:group_id")
  .delete(withdrawGroup)
  .post(applyGroup);

router.post("/:user_id/groups/:group_id/:applicant_id", updateApplicantStatus);

router.get("/:user_id/groupNotice", getGroupNotice);

module.exports = router;
