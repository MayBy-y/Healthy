import express from 'express';
import { createPost } from '../controllers/createPost.js';
import { auth } from '../middleware/auth.js';
const PostRouter = express.Router();
PostRouter.post('/post', auth, createPost)

PostRouter.get('getPost', auth, async (req, res) => {
    try {
        const { date } = req.body
    } catch (error) {

    }
})
