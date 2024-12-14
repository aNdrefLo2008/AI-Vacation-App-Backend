const dotenv = require("dotenv");
dotenv.config();

let openai;

// Dynamically import the OpenAI module and initialize
(async () => {
    const { default: OpenAI } = await import("openai");
    openai = new OpenAI({
        apiKey: process.env.NEW_OPENAI_TESTKEY, // Ensure this is set in your .env file
    });
})();

// AI Controller to handle user input
const getAIResponse = async (req, res) => {
    const { userPrompt } = req.body;

    if (!userPrompt) {
        return res.status(400).json({ error: "User prompt is required." });
    }

    try {
        // Request completion from the OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-0125", // You can change this model to a different one, if needed.
            messages: [
                { role: "system", content: "You are a helpful travel assistant." },
                { role: "user", content: userPrompt },
            ],
        });

        const aiResponse = completion.choices[0].message.content; // Extract the AI's response

        // Send back the AI response to the client
        res.status(200).json({ message: aiResponse });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({ error: "Failed to generate AI response." });
    }
};

module.exports = { getAIResponse };
