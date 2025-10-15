const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  createUser
} = require('../controllers/userController');
const { validateUser, validateRegistration } = require('../middleware/validation');

router.post('/', validateUser, createUser);
router.post('/register', validateRegistration, registerForEvent);
router.post('/cancel-registration', validateRegistration, cancelRegistration);

module.exports = router;