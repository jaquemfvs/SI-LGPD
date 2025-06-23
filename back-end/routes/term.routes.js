const controller = require("../controllers/term.controller.js");
const router = require("express").Router();

router.post("/version", controller.createVersion);
router.post("/term", controller.createTerm);
router.post("/log", controller.createLog);
router.get("/version/:versionId", controller.fetchTermsByVersionId);
router.get("/:id", controller.fetchTermById);
router.get("/latest-terms", controller.fetchLatestTerms);

module.exports = router;
