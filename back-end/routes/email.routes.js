const controller = require('../controllers/email.controller.js')
const router = require('express').Router();

router.post('/newsletter', controller.sendEmailNewsletter);
router.post('/promotional', controller.sendEmailPromotional);

module.exports = router;