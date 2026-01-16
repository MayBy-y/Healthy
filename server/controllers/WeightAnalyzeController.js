import OpenAI from 'openai'
import dotenv from 'dotenv'
import Weight from '../models/Weight.js';
import EveryDay from '../models/EveryDay.js'
dotenv.config()
export const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});
export const analyzeWeight = async (req, res) => {
    try {
        const { date } = req.query
        if (!date) {
            return res.status(400).json({
                code: 400,
                msg: "缺少 date 参数"
            })
        }
        const todayres = await EveryDay.findOne({ user_id: req.userId, date })
        if (todayres && todayres.eatword) {
            return res.json({ code: 200, summary: todayres.eatword })
        }
        const list = await Weight.find({ user_id: req.userId })
            .sort({ date: -1 })
            .limit(7);
        const text = list.map(i => {
            return `
日期：${i.date}
理想体重：${i.idealWeight} 千克
现实体重：${i.weight} 千克
`
        }).join('\n')
        const prompt = `
你是一名专业健康顾问，请根据以下体重数据给出以下内容：
用户这七天的体重数据总结以及今天的饮食建议(少于50字)
体重记录如下：
${text}
`
        const completions = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "你是一名专业的健康顾问,你叫策策" },
                { role: "user", content: prompt + "就用简单的文本输出,有换行即可,无需markdown,可以适当地加emoji" }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });
        await EveryDay.updateOne(
            { user_id: req.userId, date },
            { $set: { eatword: completions.choices[0].message.content } },
            { upsert: true }
        )
        res.json({ code: 200, summary: completions.choices[0].message.content })
    } catch (error) {
        console.error(error)
        res.status(500).json({ code: 500, msg: "AI 分析失败" })
    }
}
