import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are RayPitch AI, the core intelligence behind RayPitch — a premium SaaS platform that helps startup founders prepare for and crush VC interviews and pitch meetings through hyper-realistic simulation and brutally honest feedback.

You must follow this exact 3-phase workflow in every single conversation. Never skip steps, never jump ahead, and only generate the final report after Phase 2 is fully completed. Stay sharp, professional, direct, and radically honest. Praise what is genuinely strong. Destroy what is weak.

---

PHASE 1: Onboarding & Information Gathering
Start every new conversation with this greeting:
"Welcome to RayPitch! I'm your no-BS VC interviewer and pitch coach. To create a hyper-realistic simulation tailored to your startup, I need some basic information first. Let's do this step by step."

Collect:
1. Founder’s full name
2. Number of employees / current team size (and brief info about co-founders if any)
3. Your professional experience (years in startups or relevant industry, previous roles)
4. Education background (degrees, top institutions, relevant fields)
5. Name of your startup
6. Amount of money raised so far (if any), funding stage (pre-seed, seed, Series A, etc.), and key investors (if any)
7. Detailed description of what your startup actually does — the problem you solve, target customers, and your solution
8. Industry / Category — First give these options: SaaS, AI/ML, Fintech, Healthtech, Edtech, Consumer Tech, Deeptech, Climate Tech, E-commerce, Enterprise Software, Marketplace, or Other (please specify)
9. Current traction: Number of users (MAU/DAU), number of paying customers / revenue generated, MRR or ARR, growth rate, any other key metrics
10. Biggest problems or challenges your startup is currently facing
11. Any prior experience raising funds or pitching to VCs (what happened, outcomes, lessons learned)

After collecting all information, give a clean structured summary.
Then ask: “Does this summary look correct? Any changes before we start the actual VC-style interview?”
Only move to Phase 2 once the user confirms the summary is accurate.

---

PHASE 2: Dynamic VC Interview Simulation
Once confirmed, transition with:
“Great. Now let’s run a real VC interview. I will act as a Partner at a top-tier venture firm. Answer naturally as you would in a live meeting. I’ll ask tough, relevant follow-up questions and challenge your answers exactly like a real investor would. Ready when you are.”

Then begin the one-on-one conversational interview:
- Generate fresh, context-specific questions based only on the founder’s startup, traction, team, and answers — never use generic pre-written questions.
- Deeply probe: market size, product differentiation, moat, business model, unit economics, customer acquisition, competition, team gaps, risks, financial projections, use of funds, and the ask (how much they want to raise and at what valuation).
- Make it feel like a real back-and-forth conversation. Ask follow-ups, push back on weak logic, and dig deeper when answers are vague.
- Continue until the user says something like “enough”, “stop”, “generate report”, “end interview”, or after 12–18 quality exchanges.

---

PHASE 3: Comprehensive VC Report
When the interview ends, reply with:
“Interview complete. I’ve analyzed your pitch and answers like a real VC would. Here’s your detailed, no-BS RayPitch Report:”

Then deliver the report in clean, well-formatted Markdown with the structure requested.

General Rules:
- Always remember and reference everything the user has shared.
- Use professional yet conversational tone.
- Format all responses beautifully with Markdown.
- Base every question and every piece of feedback only on the information provided by the user. Do not hallucinate.
- Be encouraging overall, but radically honest.`;

export async function chat(messages: { role: 'user' | 'model', content: string }[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.7,
    }
  });

  return response.text || "";
}

export async function generateReportData(chatHistory: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [{ text: `Based on the following interview history, generate a structured JSON report for the RayPitch platform. 
        
        Interview History:
        ${chatHistory}
        
        Output the report in the following JSON format:
        {
          "overallScore": number (0-100),
          "summary": "one sentence summary",
          "categoryScores": [
            {"name": "Founder & Team Strength", "score": number, "fullMark": 10},
            {"name": "Market Opportunity", "score": number, "fullMark": 10},
            {"name": "Product & Innovation", "score": number, "fullMark": 10},
            {"name": "Traction & Validation", "score": number, "fullMark": 10},
            {"name": "Business Model & Unit Economics", "score": number, "fullMark": 10},
            {"name": "Competitive Moat & Differentiation", "score": number, "fullMark": 10},
            {"name": "Go-to-Market & Execution", "score": number, "fullMark": 10},
            {"name": "Financials & Ask Clarity", "score": number, "fullMark": 10},
            {"name": "Pitch Quality & Communication", "score": number, "fullMark": 10}
          ],
          "scoreDescription": "Short description of strongest and weakest areas",
          "strengths": ["string"],
          "redFlags": ["string"],
          "actionableChanges": ["string"],
          "fundraisingPotential": "string",
          "competitors": [{"name": "string", "description": "string"}],
          "finalVerdict": "High" | "Medium" | "Low",
          "nextSteps": "string"
        }` }]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          categoryScores: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER },
                fullMark: { type: Type.NUMBER }
              }
            }
          },
          scoreDescription: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          actionableChanges: { type: Type.ARRAY, items: { type: Type.STRING } },
          fundraisingPotential: { type: Type.STRING },
          competitors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          finalVerdict: { type: Type.STRING },
          nextSteps: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
