import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide symptoms." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
A patient reports the following symptoms: ${symptoms}.  
Provide a **brief and structured** diagnosis with three sections:  
1]**Common Causes** (Mild to Moderate)  
2] **Serious Causes** (Emergency or Severe)  
3]**Rare Possibilities**  

For each, mention:  
- **Condition Name**  
- **Key Symptoms (Bullet Points, Max 2-3)**  

At the end, include:  
- **Urgent Medical Indicators (Max 5 Points)**  
- **Disclaimer:** "Consult a doctor for diagnosis."  
Keep it **short (Max 5-6 lines total)**.
`;

    const result = await model.generateContent(prompt);
    const response = result.response.candidates[0].content.parts[0].text;

    return res.status(200).json({
      success: true,
      message: "AI Analysis Complete",
      data: response,
    });
  } catch (error) {
    console.error("Error in AI Symptom Checker:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default checkSymptoms;
