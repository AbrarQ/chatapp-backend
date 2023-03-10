const express = require('express')
const router = express.Router();
const groupControllers = require('../Controllers/groupController')

router.post('/addnewgc', groupControllers.addnewgroup)
router.post('/adduser', groupControllers.adduser)
router.post('/superuser', groupControllers.superuser)
router.post('/fetchuser', groupControllers.fetchuser)
router.post('/deleteuser', groupControllers.deleteUser)
router.get('/getlist', groupControllers.getlist)



module.exports = router