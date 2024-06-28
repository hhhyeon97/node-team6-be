const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

router.post('/', userController.createUser);
router.get('/me', authController.authenticate, userController.getUser);
router.put('/me', authController.authenticate, userController.editUser);
router.delete('/me/:id', authController.authenticate, userController.deleteUser)
// admin
router.get('/', userController.getUserList);
router.put('/:id', userController.updateUserLevel);

module.exports = router;
