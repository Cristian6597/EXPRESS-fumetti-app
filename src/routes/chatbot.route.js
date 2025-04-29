//per avviare il chatbot, aprire bas e inserire "ollama run llama2"
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const chatbotRouter = express.Router();

chatbotRouter.use(bodyParser.json());

const OLLAMA_API_URL = "http://localhost:11434/v1/chat/completions"; // Ollama API locale
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY; // Aggiungi la tua chiave API se necessaria

chatbotRouter.post("/chat", async (req, res) => {
  const { userMessage } = req.body;

  try {
    const response = await axios.post(
      OLLAMA_API_URL,
      {
        model: "llama2", // Usa il modello di Ollama che preferisci (LLaMA, Mistral, ecc.), endpoint chiamate http://localhost:11434
        messages: [
          {
            role: "system",
            //Dare informazioni per settare il chatbot
            content:
              "Sei un assistente nerd appassionato di fumetti, manga, videogiochi.",
          },
          { role: "user", content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OLLAMA_API_KEY}`, // Se necessiti di una chiave API
          "Content-Type": "application/json",
        },
      }
    );

    const botMessage =
      response.data.choices[0].message.content || "Errore nella generazione.";

    res.json({ botResponse: botMessage });
  } catch (error) {
    console.error("Errore Ollama:", error.message);
    res.status(500).send("Errore con il chatbot Ollama");
  }
});

export default chatbotRouter;
