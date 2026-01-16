import OpenAI from 'openai'
import dotenv from 'dotenv'
import DeepSleep from '../models/DeepSleep.js'
import EveryDay from '../models/EveryDay.js'
dotenv.config()
const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});
export const analyzeSleep = async (req, res) => {
    try {
        const list = await DeepSleep.find({ user_id: req.userId })
            .sort({ date: -1 })
            .limit(7);
        const text = list.map(i => {
            return `
日期：${i.date}
总睡眠：${i.totalSleepDuration.toFixed(1)} 小时
深睡：${i.deepSleepDuration} 小时
浅睡：${i.lightSleepDuration} 小时
清醒次数：${i.awakeDuration} 次
效率：${i.efficiency.toFixed(1)}%
`

        }).join('\n')

        const prompt = `
你是一名专业健康顾问，请根据以下睡眠数据给出3部分内容：
1. 本月睡眠总结（字数控制在100字）
2. 我的睡眠问题分析，简明扼要地分析，以序号的形式输出
3. 具体可执行的改善建议（只要3条，尽量简洁，以序号的形式输出）
睡眠记录如下：
${text}
`
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
        if (todayres && todayres.sleepword) {
            return res.json({ code: 200, summary: todayres.sleepword })
        }
        if (!date) {
            return res.status(400).json({
                code: 400,
                msg: '暂未传入数据'
            })
        }
        const i = await DeepSleep.findOne({ user_id: req.userId, date })
        const text = `
        日期：${i.date}
总睡眠：${i.totalSleepDuration.toFixed(1)} 小时
深睡：${i.deepSleepDuration} 小时
浅睡：${i.lightSleepDuration} 小时
清醒次数：${i.awakeDuration} 次
效率：${i.efficiency.toFixed(1)}%
        `
        const prompt = `
    你是一名专业健康顾问，请根据以下睡眠数据给出下面内容：
    今天的睡眠总结及明天的睡眠建议，（字数控制在50字内）
睡眠记录如下：
${text}`
        const completions = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "你是一名专业的睡眠健康顾问,你叫策策" },
                { role: "user", content: prompt + "就用简单的文本输出,可以适当地加emoji" }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });
        await EveryDay.updateOne(
            { user_id: req.userId, date },
            { $set: { sleepword: completions.choices[0].message.content } },
            { upsert: true }
        )
        res.json({ code: 200, summary: completions.choices[0].message.content })
    } catch (error) {
        console.error(error)
        res.status(500).json({ code: 500, msg: "AI 分析失败" })
    }

}
export const saveSleepList = async (req, res) => {
    const { sleepStart, sleepEnd, deepSleepDuration, lightSleepDuration, awakeDuration, date } = req.body;
    try {
        const sleepStartTime = new Date(sleepStart)
        const sleepEndTime = new Date(sleepEnd)
        const totalSleepDuration = (sleepEndTime.getTime() - sleepStartTime.getTime()) / (1000 * 60 * 60);
        const efficiency = (deepSleepDuration + lightSleepDuration) / totalSleepDuration * 100
        const updatedRecord = await DeepSleep.findOneAndUpdate(
            {
                user_id: req.userId,
                date: date,
            },
            {
                sleepStart: sleepStartTime,
                sleepEnd: sleepEndTime,
                deepSleepDuration,
                lightSleepDuration,
                awakeDuration,
                totalSleepDuration,
                efficiency,
            },
            {
                new: true,
                upsert: true,
            }
        );
        res.status(200).json({ code: 200, message: updatedRecord ? '睡眠数据更新成功' : '睡眠数据保存成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ code: 500, message: '保存或更新睡眠数据失败' });
    }
}
