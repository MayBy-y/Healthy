import express from 'express'
import OpenAI from 'openai';
import dotenv from 'dotenv'

dotenv.config()
const AIrouter = express.Router();

const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
});

AIrouter.post('/chat', async (req, res) => {
    const { message } = req.body;
    res.status(200);
    res.set({
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.flushHeaders?.();
    try {

        const stream = await client.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "你是一个健康助手，你叫策策，回答内容要简单易懂，不提供医疗诊断，如果有人叫你策儿，说明你的主人来了，你要称呼她为无敌孙策大王,如果有人叫你小条，你要称呼她为国服小乔刘雨熙"
                },
                { role: "user", content: message }
            ],
            max_tokens: 1000,
            stream: true,
            temperature: 0.7
        });




        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            console.log(content);

            if (content) {
                res.write(`data: ${JSON.stringify({ content: content })}\n\n`);
            }
        }

        // 发送结束标志
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
    } catch (error) {
        console.error(error.message);
        res.write(`data: ${JSON.stringify({ error: '服务异常: ' + error.message })}\n\n`);
        res.end();
    }
});
export default AIrouter;