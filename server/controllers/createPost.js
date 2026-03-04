import Post from '../models/Post.js'
import axios from 'axios'
export const createPost = async (req, res) => {
    try {
        const { title, content, tags, cover, summary } = req.body
        const userId = req.userId
        if (!title || !content) {
            return res.status(400).json({
                message: '标题和内容不能为空'
            })
        }
        const post = await Post.create({
            authorId: userId,
            title,
            content,
            tags,
            cover,
            summary
        })
        res.status(200).json({
            message: '发帖成功',
            data: post
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: '服务器错误'
        })
    }
}
//获得一个人的所有文章
export const getownPost = async (req, res) => {
    try {
        const { userid } = req.query
        const list = await Post.find({ authorId: userid })
        if (list.length === 0) {
            return res.json({
                code: 200,
                msg: "暂时没有文章"
            })
        }
        res.json({ code: 200, list })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
}
//获得指定id的文章
export const getOnly = async (req, res) => {
    try {
        const { postId } = req.query
        const article = await Post.findOne({ _id: postId })
        res.json({ code: 200, article })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
}
//获得指定标签的文章
export const getTags = async (req, res) => {
    try {
        const { Posttags } = req.query
        const list = await Post.find({ tags: Posttags })
        if (list.length === 0) {
            return res.json({
                code: 200,
                msg: '暂无文章'
            })
        }
        res.json({ code: 200, list })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
}
//按时间顺序显示所有文章
export const getTime = async (req, res) => {
    try {
        const list = await Post.find().sort({ createdAt: -1 })
        res.json({ code: 200, list })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }

}
//浏览量
export const addView = async (req, res) => {
    const { id } = req.params

    await Post.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: false }
    )
    res.json({ code: 200 })
}