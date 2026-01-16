import express from 'express'
import Sport from '../models/Sport.js'
import { auth } from '../middleware/auth.js'
import { analyzeSport, TodayAnalyze } from '../controllers/SportAnalyzeController.js'
const SportsRouter = express.Router()
SportsRouter.post('/', auth, async (req, res) => {
    try {
        const { date } = req.body
        const sport = await Sport.findOneAndUpdate(
            { user_id: req.userId, date },
            { ...req.body },
            { new: true, upsert: true }
        );

        res.json({ code: 200, data: sport });
    } catch (error) {
        console.error("添加/更新运动记录出错:", error);
        res.status(500).json({ code: 500, error: error.message });
    }
})
SportsRouter.get('/today', auth, async (req, res) => {
    try {
        const today = req.query.date
        const result = await Sport.findOne({ user_id: req.userId, date: today })
        res.json({ code: 200, data: result })
    } catch (error) {
        res.json({ code: 500, error: error.message })
    }
})
SportsRouter.get('/list', auth, async (req, res) => {
    try {
        const result = await Sport.find({ user_id: req.userId, })
            .sort({ date: -1 })
            .limit(7)

        res.json({ code: 200, data: result })
    } catch (error) {
        res.json({ code: 500, error: error.message })
    }
})
SportsRouter.post('/ai', auth, analyzeSport)
SportsRouter.post('/todayAnalyze', auth, TodayAnalyze)
export default SportsRouter