const controller = require('../controllers/security.controller.js')
const router = require('express').Router();
const authMiddleware = require('../middleware/auth.middleware');

router.post('/backup-db', authMiddleware, controller.backupDatabase); 
router.put('/restore-db', authMiddleware, controller.restoreDatabase);

module.exports = router;