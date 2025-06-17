require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index', { chat: [] });
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }]
    })
  });
  const data = await response.json();
  const aiReply = data.choices?.[0]?.message?.content || "Maaf, terjadi kesalahan.";
  res.json({ reply: aiReply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("✅ Server berjalan di http://localhost:" + PORT));