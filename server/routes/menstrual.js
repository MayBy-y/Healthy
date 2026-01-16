import express from 'express'
import Menstrual from '../models/Menstrual.js'
import { auth } from '../middleware/auth.js';
import analyMen from '../controllers/menController.js'
const menstrualRouter = express.Router()

menstrualRouter.post('/add', auth, async (req, res) => {
    try {
        const { data } = req.body;
        console.log("收到前端数据：", data);
        const item = await Menstrual.create({
            user_id: req.userId,
            startDate: data.startDate,
            stayTime: data.stayTime,
            leaveTime: data.leaveTime
        });
        res.json({ code: 200, data: item });
    } catch (error) {
        console.error(error)
        res.json({ code: 500, msg: '服务器错误' });
    }
})
menstrualRouter.post('/ai', auth, analyMen)
menstrualRouter.get('/last', auth, async (req, res) => {
    try {
        const record = await Menstrual.find({ user_id: req.userId })
            .sort({ startDate: -1 });
        if (!record) {
            return res.json({ code: 200, data: null, msg: "没有数据" });
        }

        res.json({ code: 200, data: record });
    } catch (error) {
        console.log(error);
        res.status(500).json({ code: 500, msg: "服务器错误" });
    }

})
export default menstrualRouter