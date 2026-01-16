import { register, login, getUserInfo } from '../controllers/userController.js'
import express from 'express'
import { auth } from '../middleware/auth.js'
const Userrouter = express.Router()
Userrouter.post('/register', register)
Userrouter.post('/login', login)
Userrouter.get('/info', auth, getUserInfo)
export default Userrouter