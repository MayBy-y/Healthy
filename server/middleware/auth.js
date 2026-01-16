import jwt from 'jsonwebtoken'

export const auth = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ code: 401, msg: '未提供 token' })
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret')
        req.userId = decoded.id
        next()
    } catch (err) {
        return res.status(401).json({ code: 401, msg: 'token 无效或已过期' })
    }
}