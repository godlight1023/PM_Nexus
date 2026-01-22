import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Create a custom OpenAI instance for DeepSeek
const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      return new Response("Missing DeepSeek API Key", { status: 401 });
    }

    const result = await streamText({
      model: deepseek('deepseek-chat'),
      messages,
      system: '你是一个生活在 "PM Nexus"（一个个人知识工作台）中的智能 AI 助手。你帮助用户整理思绪、总结内容，并提供关于产品管理和技术的见解。请务必使用中文回复，保持简洁、专业且乐于助人。',
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error('AI Error:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
