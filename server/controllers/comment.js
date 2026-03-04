import Comment from "../models/Comment.js";

//发表评论
export const createComment = async (req, res) => {
    const { content, articleId, parentId, replyTo } = req.body
    let rootId = null
    if (parentId) {
        const parent = await Comment.findById(parentId)
        rootId = parent.rootId || parent._id

    }
    const comment = await Comment.create({
        content,
        articleId,
        userId: req.userId,
        parentId: parentId || null,
        rootId,
        replyTo: replyTo || null
    })
    if (!parentId) {
        comment.rootId = comment._id
        await comment.save()
    }
    res.json({ code: 200, data: comment })
}

//获取评论列表
export const getComment = async (req, res) => {
    const { articleId, page = 1, limit = 10 } = req.query
    //查一级评论
    const roots = await Comment.find({
        articleId,
        parentId: null,
        isDeleted: false,
    })
        .populate('userId', 'username avatar')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean()
    //查所有子评论
    const children = await Comment.find({
        articleId,
        parentId: { $ne: null },
        isDeleted: false,
    })
        .populate('userId', 'username avatar')
        .lean()
    const map = new Map()
    roots.forEach(r => {
        r.children = []
        map.set(r._id.toString(), r)
    })

    children.forEach(c => {
        c.children = []
        map.set(c._id.toString(), c)
    })

    children.forEach(c => {
        const parent = map.get(c.parentId.toString())
        parent && parent.children.push(c)
    })

    res.json({ code: 200, data: roots })
}
//软删除
export const deleteComment = async (req, res) => {
    const { commentId } = req.query
    const comment = await Comment.findById(req.params.id)

    if (!comment) return res.status(404).end()
    if (comment.userId.toString() !== req.userId) {
        return res.status(403).end()
    }

    comment.isDeleted = true
    comment.content = '该评论已删除'
    await comment.save()

    res.json({ code: 200 })
}
//点赞
export const likeComment = async (req, res) => {
    try {
        const userId = req.userId
        const { commentId } = req.query

        const comment = await Comment.findById(commentId)

        if (!comment) {
            return res.status(404).json({ message: '评论不存在' })
        }

        const hasLiked = comment.likedUsers.includes(userId)

        if (hasLiked) {
            // 取消点赞
            comment.likes -= 1
            comment.likedUsers = comment.likedUsers.filter(
                id => id.toString() !== userId
            )
        } else {
            // 点赞
            comment.likes += 1
            comment.likedUsers.push(userId)
        }

        await comment.save()

        res.json({
            code: 200,
            message: hasLiked ? '已取消点赞' : '点赞成功',
            likes: comment.likes
        })

    } catch (err) {
        res.status(500).json({ message: '服务器错误' })
    }
}

