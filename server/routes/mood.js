import express from 'express';
import Mood from '../models/Mood.js';
import { auth } from '../middleware/auth.js';
import { TodayAnalyze } from '../controllers/MoodAnalyzeController.js'

const Moodrouter = express.Router();
Moodrouter.post('/', auth, async (req, res) => {
    try {
        const { date, IdealMood, mood } = req.body
        const record = await Mood.findOneAndUpdate(
            { user_id: req.userId, date },
            { IdealMood, mood },
            { new: true, upsert: true }
        );

        res.json({
            code: 200,
            msg: "保存成功（自动判断新增/更新）",
            data: record
        });
    }
    catch (error) {
        console.log(error);

        return res.json({ code: 500, msg: '服务器错误' })
    }
})
Moodrouter.get('/today', auth, async (req, res) => {
    try {
        const today = req.query.date
        const data = await Mood.findOne({
            user_id: req.userId,
            date: today
        })

        res.json({ code: 200, data })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
})
Moodrouter.get('/mood', auth, async (req, res) => {
    try {
        const list = await Mood.find({ user_id: req.userId })
            .sort({ date: -1 })
            .limit(30)
        res.json({ code: 200, data: list })
    } catch (error) {
        res.json({ code: 500, msg: '服务器错误' })
    }
})
Moodrouter.post('/todayAnalyze', auth, TodayAnalyze)
export default Moodrouter;