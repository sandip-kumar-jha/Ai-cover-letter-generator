const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateCoverLetter(data) {
  const prompt = `
You are an expert HR Manager and Technical Recruiter.

Write a professional, ATS-friendly cover letter in Markdown format.

Instructions:
- Start with "Dear Hiring Manager,"
- Mention the candidate's name.
- Mention the target company.
- Mention the job role.
- Highlight the candidate's skills.
- If resume content is provided, use it to personalize the cover letter.
- Keep the tone professional and confident.
- End with a strong closing.
- Return ONLY the cover letter in Markdown.

Candidate Name:
${data.name}

Target Company:
${data.company}

Job Role:
${data.role}

Skills:
${data.skills}

Resume Content:
${data.resumeText || "No resume uploaded."}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const result = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", result);

    if (!response.ok) {
      throw new Error(result?.error?.message || "Gemini API Error");
    }

    return (
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received from Gemini."
    );
  } catch (error) {
    console.warn("Gemini API Failed:", error.message);

    return `
# Cover Letter

**Dear Hiring Manager,**

I am writing to express my interest in the **${data.role}** position at **${data.company}**.

My name is **${data.name}**, and I possess strong skills in **${data.skills}**.

${
  data.resumeText
    ? `Based on my resume, I have experience in the following areas:

${data.resumeText.substring(0, 800)}

`
    : ""
}

I am passionate about building high-quality software, solving real-world problems, and continuously learning modern technologies. I believe my technical skills, dedication, and enthusiasm would allow me to contribute effectively to your organization.

Thank you for your time and consideration. I would welcome the opportunity to discuss how I can contribute to **${data.company}**.

Sincerely,

**${data.name}**
`;
  }
}