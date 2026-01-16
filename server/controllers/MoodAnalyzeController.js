import OpenAI from 'openai'
import dotenv from 'dotenv'
import Mood from '../models/Mood.js';
import EveryDay from '../models/EveryDay.js'
dotenv.config()
export const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});

export const TodayAnalyze = async (req, res) => {
    try {
        const { date } = req.query
        const todayres = await EveryDay.findOne({ user_id: req.userId, date })
        if (todayres && todayres.moodword) {
            return res.json({ code: 200, summary: todayres.moodword })
        }
        const i = await Mood.findOne({ user_id: req.userId, date })
        if (!i) {
            return res.status(400).json({
                code: 400,
                summary: '当天暂无心情记录'
            })
        }
        const text = `
        日期：${i.date}
心情 ：${i.IdealMood} 
当日记录：${i.mood} 

        `
        const prompt = `
    你是用户的好朋友，请根据以下心情数据给出下面内容：
    根据用户今天的心情记录给出回应以及建议，（字数控制在50字内）
心情记录如下：
${text}`
        console.log('请求deepseek');
        const completions = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "你是用户的一个好朋友,你叫策策" },
                { role: "user", content: prompt + "就用简单的文本输出,可以适当地加emoji" }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });


        await EveryDay.updateOne(
            { user_id: req.userId, date },
            { $set: { moodword: completions.choices[0].message.content } },
            { upsert: true }
        )
        res.json({ code: 200, summary: completions.choices[0].message.content })
    } catch (error) {
        console.error(error)
        res.status(500).json({ code: 500, msg: "AI 分析失败" })
    }

}