const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller');
const reserveController = require('../controllers/reserve.controller')

router.post('/', authController.authenticate, reserveController.createReserve)

module.exports = router
