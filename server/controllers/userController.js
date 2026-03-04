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
    const userAvatar = exist.avatar
    res.json({ code: 200, msg: '登录成功', token, userIds, username, userAvatar })
}
//获取用户信息
export const getUserInfo = async (req, res) => {
    const user = await User.findById(req.userId).select('-password')
    res.json({ code: 200, data: user })
}
//获取指定用户信息
export const getOther = async (req, res) => {
    const { authorId } = req.query
    const user = await User.findById(authorId).select('-password')
    res.json({ code: 200, data: user })
}
//修改用户信息
export const updateProfile = async (req, res) => {
    try {
        const user_id = req.userId
        const updateData = req.body // 👈 Partial<UserProfile>

        const user = await User.findByIdAndUpdate(
            user_id,
            { $set: updateData },
            { new: true } // 返回更新后的数据
        ).select('-password')

        res.json({
            code: 200,
            data: user
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            code: 500,
            msg: '更新用户信息失败'
        })
    }
}
//关注一个用户
export const followUser = async (req, res) => {
    const userId = req.userId
    const { followUserId } = req.query

    if (userId === followUserId) {
        return res.json({ code: 400, msg: '不能关注自己' })
    }
    try {
        //当前用户
        await User.findByIdAndUpdate(userId, {
            $addToSet: { following: followUserId }
        })
        //被关注用户
        await User.findByIdAndUpdate(followUserId, {
            $addToSet: { followers: userId }
        })
        res.json({ code: 200, msg: '关注成功' })
    } catch (error) {
        console.log(error);
        res.json({ code: 500, msg: '...' })
    }
}
//取消关注
export const unfollowUser = async (req, res) => {
    const userId = req.userId
    const { targetId } = req.query

    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { following: targetId }
        })

        await User.findByIdAndUpdate(targetId, {
            $pull: { followers: userId }
        })

        res.json({ code: 200, msg: '已取消关注' })
    } catch (e) {
        res.json({ code: 500, msg: '服务器错误' })
    }
}
//获取所有粉丝的信息
export const getFollows = async (req, res) => {
    const userId = req.userId
    try {
        const user = await User.findById(userId)
            .populate('followers', 'username avatar Introduction')

        res.json({ code: 200, data: user?.followers })
    } catch (e) {
        res.json({ code: 500, msg: '服务器错误' })
    }
}
export const getFollowing = async (req, res) => {
    const userId = req.userId
    try {
        const user = await User.findById(userId)
            .populate('following', 'username avatar Introduction')

        res.json({ code: 200, data: user?.following })
    } catch (e) {
        res.json({ code: 500, msg: '服务器错误' })
    }
}