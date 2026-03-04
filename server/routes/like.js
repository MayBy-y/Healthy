import express from 'express'
import { likeArticle, unlikeArticle, getLikeStatus } from '../controllers/likeController.js'
import { auth } from '../middleware/auth.js';

const Likerouter = express.Router()

Likerouter.post('/golike/:id', auth, likeArticle)

Likerouter.delete('/unlike/:id', auth, unlikeArticle)

Likerouter.get('/likefor/:id', auth, getLikeStatus)

export default Likerouter