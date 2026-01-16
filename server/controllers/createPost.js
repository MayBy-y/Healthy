import Post from '../models/Post.js'
import axios from 'axios'
export const createPost = async (req, res) => {
    try {
        const { title, content, tags } = req.body
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
            tags
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

export const fetchArticles = async (req, res) => {
    try {
        const { topic = 'nutrition', limit = 10 } = req.query
        const { data } = await axios.get(
            'https://tools.cdc.gov/api/v2/resources/media',
            {
                params: {
                    topic,
                    language: 'en',
                    limit,
                    sort: ''
                },
            }
        )
    } catch (error) {

    }
}