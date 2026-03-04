import express from 'express'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Userrouter from './routes/user.js'
import cors from 'cors'
import Sleeprouter from './routes/sleep.js'
import Sportrouter from './routes/step.js'
import Weightrouter from './routes/weight.js'
import Moodrouter from './routes/mood.js'
import AIrouter from './routes/ai.js'
import SportsRouter from './routes/sport.js'
import DeepSleepRouter from './routes/deepSleep.js'
import menstrualRouter from './routes/menstrual.js'
import UploadRouter from './routes/upload.js'
import PostRouter from './routes/post.js'
import CommentRouter from './routes/useComment.js'
import Likerouter from './routes/like.js'
import path from 'path'
const app = express()
app.use(cors(
    //     {
    //     origin: 'http://localhost:5173',
    //     credentials: true
    // }
))
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
    next()
})
app.use(express.json())
app.use('/api', Userrouter)
app.use('/api/sleep', Sleeprouter);
app.use('/api/steps', Sportrouter);
app.use('/api/weight', Weightrouter);
app.use('/api/mood', Moodrouter);
app.use('/api/ai', AIrouter);
app.use('/api/sport', SportsRouter);
app.use('/api/deepsleep', DeepSleepRouter)
app.use('/api/menstrual', menstrualRouter)
//暴露静态资源
app.use('/api/uploads', UploadRouter)
app.use('/api/post', PostRouter)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/comment', CommentRouter)
app.use('/api/articles', Likerouter)
connectDB()

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})
