import Like from '../models/Like.js'

// 👍 点赞
export const likeArticle = async (req, res) => {
    try {
        const userId = req.userId
        const articleId = req.params.id

        const existing = await Like.findOne({ userId, articleId })

        if (existing) {
            return res.status(400).json({ message: '已经点赞过了' })
        }

        await Like.create({ userId, articleId })

        const count = await Like.countDocuments({ articleId })

        res.json({
            code: 200,
            liked: true,
            count
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '点赞失败' })
    }
}

// 👎 取消点赞
export const unlikeArticle = async (req, res) => {
    try {
        const userId = req.userId
        const articleId = req.params.id

        await Like.deleteOne({ userId, articleId })

        const count = await Like.countDocuments({ articleId })

        res.json({
            code: 200,
            liked: false,
            count
        })
    } catch (err) {
        res.status(500).json({ message: '取消点赞失败' })
    }
}

// 📊 获取点赞状态
export const getLikeStatus = async (req, res) => {
    try {
        const userId = req.userId
        const articleId = req.params.id

        const liked = await Like.exists({ userId, articleId })
        const count = await Like.countDocuments({ articleId })

        res.json({
            code: 200,
            liked: !!liked,
            count
        })
    } catch (err) {
        res.status(500).json({ message: '获取点赞状态失败' })
    }
}