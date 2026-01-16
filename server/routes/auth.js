const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const generateToken = require('../utils/token')
import authMiddleware from "../middleware/auth.js";
const router = express.Router()

// 注册
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password)
            return res.status(400).json({ message: 'Missing username or password' })

        const exists = await User.findOne({ username })
        if (exists) return res.status(409).json({ message: 'Username exists' })

        const hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS))
        const newUser = await User.create({ username, password: hash })

        res.json({ message: 'Register success', userId: newUser._id })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// 登录
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) return res.status(401).json({ message: 'Wrong username or password' })

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) return res.status(401).json({ message: 'Wrong username or password' })

        const token = generateToken(user)
        res.json({ message: 'Login success', token })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ code: 200, user });
    } catch (error) {
        res.status(500).json({ code: 500, message: "服务器错误" });
    }
})
module.exports = router
