import express from 'express'
const router = express.Router()

import userController from '../controller/userController.js'

router.get('/login',userController.login)
router.get('/register',userController.registerPage)
router.post('/register',userController.register)



export default router