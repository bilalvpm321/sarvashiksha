// pages/api/chat.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `John Doe, a 21-year-old male, is in his final year of a Bachelor's degree in Mechanical Engineering at XYZ University, where he maintains a GPA of 3.8. Known for his strong analytical skills and innovative approach, John has a particular interest in robotics, which has driven him to excel in courses like Advanced Robotics, Thermodynamics, and Control Systems. He has completed internships at ABC Tech, where he contributed to the development of a robotic arm for industrial automation, and DEF Engineering, where he assisted in optimizing mechanical designs for renewable energy systems. John is proficient in Python, MATLAB, and CAD software, with hands-on experience in 3D modeling and simulation.

Beyond academics, John is actively involved in the university's Robotics Club, where he leads a team in designing autonomous vehicles for national competitions. His senior project involves developing a self-navigating drone capable of mapping and analyzing environmental data. John is also a certified Lean Six Sigma Green Belt, which complements his passion for process improvement and efficiency.

In his spare time, John enjoys participating in hackathons, reading about the latest advancements in AI and machine learning, and mentoring underclassmen in engineering principles. He is bilingual, fluent in both English and Spanish, which he uses to collaborate with international teams. John is preparing to apply for graduate programs focused on robotics and AI, aiming to contribute to cutting-edge research in these fields.

His contact information is as follows: Email - john.doe@example.com, Phone - (123) 456-7890. When interacting with John, it is recommended to use a professional tone, addressing him as 'Mr. Doe.' Responses should be detailed, particularly in areas related to robotics, AI, and mechanical engineering, and should provide actionable insights that can assist him in advancing his academic and professional goals.`,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userInput } = req.body;

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: "hi\n" },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `Hello Mr. Doe,

It's great to connect with you. I'm impressed with your academic record and your passion for robotics and AI. Your experience at ABC Tech and DEF Engineering, as well as your active involvement in the Robotics Club, demonstrate your practical skills and commitment to the field.

What specific areas within robotics and AI are you most interested in pursuing?

I'm eager to learn more about your senior project involving the self-navigating drone and how you're applying your skills in machine learning and navigation algorithms.

Please feel free to ask me any questions you have. I'm here to provide actionable insights and support you in your academic and professional journey.

Looking forward to our conversation!`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(userInput);
    res.status(200).json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
