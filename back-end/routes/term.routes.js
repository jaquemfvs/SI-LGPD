const controller = require("../controllers/term.controller.js");
const router = require("express").Router();

router.post("/version", controller.createVersion);
router.post("/term", controller.createTerm);
router.post("/log", controller.createLog);
router.get("/latest-term", controller.fetchTermsFromLatestVersion);
router.get("/user/latest-logs", controller.fetchUserLatestTermLogs);
router.get("/version/:versionId", controller.fetchTermsByVersionId);
router.get("/:id", controller.fetchTermById);

module.exports = router;
