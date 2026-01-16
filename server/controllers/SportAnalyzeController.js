import OpenAI from 'openai'
import dotenv from 'dotenv'
import sports from '../models/Sport.js'
import EveryDay from '../models/EveryDay.js'
dotenv.config()
export const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});
export const analyzeSport = async (req, res) => {
    try {
        const list = await sports.find({ user_id: req.userId })
            .sort({ date: -1 })
            .limit(7);
        const text = list.map(i => {
            return `
日期：${i.date}
运动类型：${i.type} 
运动时长：${i.duration} 分钟
消耗热量：${i.calories} kacal
`
        }).join('\n')
        const prompt = `
你是一名专业健康顾问，请根据以下运动数据给出3部分内容：
1. 本月运动总结（字数控制在100字）
2. 我的运动问题分析,简明扼要地分析，以序号的形式输出
3. 具体可执行的改善建议（只要3条,尽量简洁，以序号的形式输出）
运动记录如下：
${text}
`
        console.log("AI Prompt:", text)
        const completions = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "你是一名专业的睡眠健康顾问,你叫策策" },
                { role: "user", content: prompt + "\n请严格用下面的 Markdown 格式输出：\n\n## 一级标题\n- 内容1\n- 内容2\n\n并且不要使用类似“数：”“运：”这种单字标题。" }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });
        res.json({ code: 200, summary: completions.choices[0].message.content })
    } catch (error) {
        console.error(error)
        res.status(500).json({ code: 500, msg: "AI 分析失败" })
    }
}
export const TodayAnalyze = async (req, res) => {
    try {
        const { date } = req.query
        const todayres = await EveryDay.findOne({ user_id: req.userId, date })
        if (todayres && todayres.sportword) {
            return res.json({ code: 200, summary: todayres.sportword })
        }
        if (!date) {
            return res.status(400).json({
                code: 400,
                msg: '暂未传入数据'
            })
        }
        const i = await sports.findOne({ user_id: req.userId, date })
        const text = `
        日期：${i.date}
运动类型：${i.type} 
运动时长：${i.duration} 分钟
消耗热量：${i.calories} kacal
        `
        const prompt = `
    你是一名专业健康顾问，请根据以下运动数据给出下面内容：
    今天的运动总结及明天的运动建议，（字数控制在50字内）
运动记录如下：
${text}`
        const completions = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "你是一名专业的运动健康顾问,你叫策策" },
                { role: "user", content: prompt + "就用简单的文本输出,可以适当地加emoji" }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });
        await EveryDay.updateOne(
            { user_id: req.userId, date },
            { $set: { sportword: completions.choices[0].message.content } },
            { upsert: true }
        )
        res.json({ code: 200, summary: completions.choices[0].message.content })
    } catch (error) {
        console.error(error)
        res.status(500).json({ code: 500, msg: "AI 分析失败" })
    }

}