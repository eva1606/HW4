const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preferenceController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/preferences', authenticateToken, preferenceController.getPreferences);
router.post('/preferences', authenticateToken, preferenceController.savePreferences);
router.get('/destinations', preferenceController.getDestinations);
router.get('/vacationTypes', preferenceController.getVacationTypes);

module.exports = router;
