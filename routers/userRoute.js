import express from 'express'
const router = express.Router()

import userController from '../controller/userController.js'
import chatController from '../controller/chatController.js'
import middleware from '../middleware/auth.js'

const {userAuth} = middleware

router.get('/',userAuth,chatController.home)
router.get('/login',userController.loginPage)
router.post('/login',userController.login)
router.get('/register',userController.registerPage)
router.post('/register',userController.register)

router.get('/search',userAuth,chatController.search)
router.get('/recent',userAuth,chatController.recent)
router.get('/message/:userId',userAuth,chatController.message)


export default router