const express = require('express')
const router = express.Router();
const chatController = require('../Controllers/chatController')

router.post('/postchat', chatController.postchat)
router.get('/getchat', chatController.getchat)


module.exports = router