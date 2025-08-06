const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Serve arquivos estáticos da pasta atual (index.html, script.js, favicon.ico, etc)
app.use(express.static('.'));

// Proxy para burlar CORS e pegar dados da API Mush
app.get('/api/player/:nick', async (req, res) => {
  const nick = req.params.nick;
  try {
    const apiRes = await fetch(`https://mush.com.br/api/player/${nick}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: 'Jogador não encontrado' });
    }
    const json = await apiRes.json();
    // envia apenas o objeto interno `response`
    res.json(json.response);
  } catch (err) {
    console.error('Erro no fetch da API Mush:', err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
