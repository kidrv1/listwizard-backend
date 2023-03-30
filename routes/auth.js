const express = require('express');
const router = express.Router();
const { checkTokenExpiration } = require('../middlewares/checkTokenExpiration');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', checkTokenExpiration, logoutUser);

module.exports = router;
