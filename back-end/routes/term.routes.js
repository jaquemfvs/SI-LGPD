const controller = require("../controllers/term.controller.js");
const authMiddleware = require("../middleware/auth.middleware"); // Importa o middleware
const router = require("express").Router();

router.post("/version", controller.createVersion); //admin
router.post("/term", controller.createTerm); //admin
router.post("/log", authMiddleware, controller.createLog); //user
router.get("/latest-term", controller.fetchTermsFromLatestVersion); //public
router.get("/user/latest-logs", authMiddleware, controller.fetchUserLatestTermLogs); //user
router.get("/user/has-signed-latest", authMiddleware, controller.hasUserSignedLatestTerms); //user
router.get("/version/:versionId", controller.fetchTermsByVersionId); //public
router.get("/:id", controller.fetchTermById); //public

module.exports = router;
