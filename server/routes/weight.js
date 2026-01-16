import express from 'express';
import Weight from '../models/Weight.js';
import { auth } from '../middleware/auth.js';
import { analyzeWeight } from '../controllers/WeightAnalyzeController.js'

const Weightrouter = express.Router();

Weightrouter.post('/', auth, async (req, res) => {
    try {
        const { date, idealWeight, weight } = req.body
        const record = await Weight.findOneAndUpdate(
            { user_id: req.userId, date },
            { idealWeight, weight },
            { new: true, upsert: true })

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

Weightrouter.get('/today', auth, async (req, res) => {
    try {
        const today = req.query.date
        const data = await Weight.findOne({
            user_id: req.userId,
            date: today
        })

        res.json({ code: 200, data })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
})

Weightrouter.get('/weight', auth, async (req, res) => {
    try {
        const list = await Weight.find({ user_id: req.userId })
            .sort({ date: -1 })
            .limit(30)
        res.json({ code: 200, data: list })
    } catch (error) {
        res.json({ code: 500, msg: '服务器错误' })
    }
})
Weightrouter.post('/todayAnaylze', auth, analyzeWeight)
export default Weightrouter;