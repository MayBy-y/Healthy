import OpenAI from 'openai'
import dotenv from 'dotenv'
import Menstrual from '../models/Menstrual.js'
dotenv.config()
const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
})
const analyMen = async (req, res) => {
    try {
        const list = await Menstrual.find({ user_id: req.userId })
            .sort({ startDate: -1 })
            .limit(3);
        if (list.length === 0) {
            return res.json({
                code: 400,
                msg: "没有找到月经记录，请先输入一次记录再生成总结。"
            });
        }
        const text = list.map(i => {
            return `
            月经开始时间：${i.startDate}
            月经持续时间：${i.stayTime}天
            周期：${i.leaveTime}天
            `
        }).join('\n')
        const prompt = `
            请根据以下月经记录生成一段健康总结：
            ${text}
            要求：
            - 使用 Markdown 输出
            - 包含：周期情况分析、排卵期判断、健康建议、规律性评估
            - 各部分包含的小段落以序号的形式输出
            - 用简短段落和列表方式呈现
            `

        const result = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: "你是一个女性健康助手,你叫策策" },
                { role: "user", content: prompt + "\n请严格用下面的 Markdown 格式输出：\n\n## 一级标题\n- 内容1\n- 内容2\n\n并且不要使用类似“数：”“运：”这种单字标题。" }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });
        res.json({ code: 200, summary: result.choices[0].message.content })
    } catch (error) {
        console.error(error)
        res.status(500).json({ code: 500, msg: "AI 分析失败" })
    }
}
export default analyMen