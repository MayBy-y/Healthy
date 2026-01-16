import express from 'express';
import { auth } from '../middleware/auth.js';
import DeepSleep from '../models/DeepSleep.js';
import { analyzeSleep, saveSleepList, TodayAnalyze } from '../controllers/SleepAnalyzeController.js'
const DeepSleepRouter = express.Router()

DeepSleepRouter.post('/deeply', auth, saveSleepList)
DeepSleepRouter.post('/ai', auth, analyzeSleep)
DeepSleepRouter.post('/oneWord', auth, TodayAnalyze)
DeepSleepRouter.get('/today', auth, async (req, res) => {
    try {
        const list = await DeepSleep.find({ user_id: req.userId })
            .sort({ date: -1 })
            .limit(7)
        res.json({ code: 200, data: list })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
})
export default DeepSleepRouter