import { register, login, getUserInfo, updateProfile, getOther, followUser, unfollowUser, getFollows, getFollowing } from '../controllers/userController.js'
import express from 'express'
import { auth } from '../middleware/auth.js'
const Userrouter = express.Router()
Userrouter.post('/register', register)
Userrouter.post('/login', login)
Userrouter.get('/info', auth, getUserInfo)
//修改
Userrouter.patch('/profile', auth, updateProfile)
//调取作者信息
Userrouter.get('/other', auth, getOther)

//关注
Userrouter.post('/focus', auth, followUser)
//取消关注
Userrouter.post('/un', auth, unfollowUser)
//获取所有粉丝信息
Userrouter.get('/getF', auth, getFollows)
Userrouter.get('/getFollowing', auth, getFollowing)
export default Userrouter