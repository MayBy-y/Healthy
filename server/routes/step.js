import express from 'express';
import Step from '../models/Step.js';
import { auth } from '../middleware/auth.js';
const Sportrouter = express.Router();
Sportrouter.post('/', auth, async (req, res) => {
    try {
        const { date, idealSteps, steps } = req.body
        const record = await Step.findOneAndUpdate(
            { user_id: req.userId, date },
            { idealSteps, steps },
            { new: true, upsert: true }
        )
        res.json({
            code: 200,
            msg: '更新成功',
            data: record
        });
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
})

Sportrouter.get('/today', auth, async (req, res) => {
    try {
        const today = req.query.date
        const data = await Step.findOne({
            user_id: req.userId,
            date: today
        })

        res.json({ code: 200, data })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
})

Sportrouter.get('/sport', auth, async (req, res) => {
    try {
        const list = await Step.find({ user_id: req.userId })
            .sort({ date: -1 })
            .limit(30)
        res.json({ code: 200, data: list })
    } catch (error) {
        res.json({ code: 500, msg: '服务器错误' })
    }
})
export default Sportrouter;