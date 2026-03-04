import express from 'express'
import { auth } from '../middleware/auth.js';
import { createComment, getComment, deleteComment, likeComment } from '../controllers/comment.js';

const CommentRouter = express.Router()

CommentRouter.post('/create', auth, createComment)

CommentRouter.get('/get', auth, getComment)

CommentRouter.delete('/delete', auth, deleteComment)

CommentRouter.post('/like', auth, likeComment)
export default CommentRouter