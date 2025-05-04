require('dotenv').config();

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// ✅ Este modelo sí está habilitado por defecto en cuentas de Google AI Studio
const GEMINI_MODEL = "gemini-2.0-flash";

app.post('/api/gemini', async (req, res) => {
  const prompt = req.body.prompt;
  console.log("📩 Prompt recibido:", prompt);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    console.log("📨 Respuesta de Gemini:", JSON.stringify(data, null, 2));

    if (data.candidates) {
      res.json(data);
    } else {
      res.status(500).send("❌ Respuesta inesperada de Gemini: " + JSON.stringify(data));
    }

  } catch (error) {
    console.error("💥 ERROR al conectar con Gemini:", error);
    res.status(500).send("Error en el servidor: " + error.message);
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend escuchando en: http://localhost:${port}`);
});
