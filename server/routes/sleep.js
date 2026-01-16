import express from 'express';
import Sleep from '../models/Sleep.js';
import { auth } from '../middleware/auth.js';
const Sleeprouter = express.Router();



//添加睡眠数据
Sleeprouter.post('/', auth, async (req, res) => {
    try {
        const { date, actualHour, targetHour, actualMin, targetMin } = req.body
        const record = await Sleep.findOneAndUpdate(
            { user_id: req.userId, date },
            { actualHour, actualMin, targetHour, targetMin },
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
//获取指定日期的睡眠数据

Sleeprouter.get('/today', auth, async (req, res) => {
    try {
        const today = req.query.date
        const data = await Sleep.findOne({
            user_id: req.userId,
            date: today
        })

        res.json({ code: 200, data })
    } catch (error) {
        console.log(error);
        return res.json({ code: 500, msg: '服务器错误' })
    }
})
//查询近30天的睡眠数据
Sleeprouter.get('/list', auth, async (req, res) => {
    try {
        const list = await Sleep.find({ user_id: req.userId })
            .sort({ date: -1 })
            .limit(7)
        res.json({ code: 200, data: list })
    } catch (error) {
        res.json({ code: 500, msg: '服务器错误' })
    }
})
export default Sleeprouter;