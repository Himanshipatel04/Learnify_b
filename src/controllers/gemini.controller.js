
export const generateDescription = async (req, res) => {
    try {
        const { description } = req.body;
        const prompt = `Write a better desciption for this description : ${description}}`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: prompt }] }] }
        );

        const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        res.json({ description: content });
    } catch (error) {
        console.log("Error generating description:", error);
        res.status(500).json({ error: "Failed to generate description" });
    }
}