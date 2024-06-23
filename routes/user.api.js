const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

router.post('/', userController.createUser);
router.get('/me', authController.authenticate, userController.getUser);
// admin
router.get('/', userController.getUserList);
router.put('/:id', userController.updateUserLevel);

module.exports = router;
