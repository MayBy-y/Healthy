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
const app = express()
app.use(cors()
    //     ({
    //     origin: 'http://localhost:5173',
    //     credentials: true
    // })
);


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
connectDB()

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})
