import express from 'express';
import { createPost, getownPost, getOnly, getTags, getTime, addView } from '../controllers/createPost.js';
import { auth } from '../middleware/auth.js';
const PostRouter = express.Router();
PostRouter.post('/new', auth, createPost)

PostRouter.get('/list', auth, getownPost)

PostRouter.get('/only', auth, getOnly)

PostRouter.get('/tags', auth, getTags)

PostRouter.get('/time', auth, getTime)

PostRouter.post('/:id/view', addView)
export default PostRouter