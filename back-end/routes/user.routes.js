const controller = require("../controllers/user.controller.js");
const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.get("/me", authMiddleware, controller.getUserInfo);
router.put("/subscription", authMiddleware, controller.updateSubscription);
router.put("/promotionalEmails", authMiddleware, controller.updatePromotionalEmailPreference);
router.patch("/:id", authMiddleware, controller.updateUserById);
router.put("/deactivate", authMiddleware, controller.deactivateUser);

module.exports = router;
