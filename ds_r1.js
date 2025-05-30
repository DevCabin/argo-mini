import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("fw_3ZbpSfSoAAAgY3afCGz3ZTW5");

const chatCompletion = await client.chatCompletion({
    provider: "fireworks-ai",
    model: "deepseek-ai/DeepSeek-R1-0528",
    messages: [
        {
            role: "user",
            content: "What is the capital of France?",
        },
    ],
});

console.log(chatCompletion.choices[0].message);