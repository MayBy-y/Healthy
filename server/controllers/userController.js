import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
//注册端口
export const register = async (req, res) => {
    let { username, password } = req.body
    username = username.trim()
    password = password.trim()
    if (!username || !password) {
        return res.json({ code: 400, msg: '用户名或密码不能为空' })
    }
    const exist = await User.findOne({ username })
    if (exist) {
        return res.json({ code: 400, msg: '该用户已存在' })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ username, password: hash })
    res.json({ code: 200, msg: '注册成功' })
}
//登录端口
export const login = async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.json({ code: 400, msg: '用户名或密码不能为空' })
    }
    const exist = await User.findOne({ username })
    if (!exist) return res.json({ code: 400, msg: '该用户不存在' })
    const isRight = await bcrypt.compare(password, exist.password)
    if (!isRight) return res.json({ code: 400, msg: '密码错误' })

    const token = jwt.sign(
        { id: exist._id },
        'your_jwt_secret',
        { expiresIn: '7d' }
    )
    const userIds = exist._id
    res.json({ code: 200, msg: '登录成功', token, userIds, username })
}
//token
export const getUserInfo = async (req, res) => {
    const user = await User.findById(req.userId).select('-password')
    res.json({ code: 200, data: user })
}
