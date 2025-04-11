const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  deleteAllMessages,
  deleteMessage,
  deleteNotStandMessages,
  deleteStandMessages,
} = require("../controllers/messageController");

router
  .route("/")
  .get(getMessages)
  .post(createMessage)
  .delete(deleteAllMessages);
router.route("/:id").delete(deleteMessage);
router.route("/not-stand").delete(deleteNotStandMessages);
router.route("/only-stand").delete(deleteStandMessages);

module.exports = router;
