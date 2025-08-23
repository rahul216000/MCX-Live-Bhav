const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

async function fetchMCXRates() {
  const url = 'https://mcxlive.org/';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  let gold, silver;

  $('#main').find('table tr').each((i, row) => {
    const symbol = $(row).find('td:nth-child(1)').text().trim();
    const lastPrice = $(row).find('td:nth-child(2)').text().trim();
    if (symbol.includes('MCX Gold') && !gold) gold = lastPrice;
    if (symbol.includes('MCX Silver') && !silver) silver = lastPrice;
  });

  return { gold, silver };
}

app.get('/api/rates', async (req, res) => {
  try {
    const rates = await fetchMCXRates();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', async (req, res) => {
  const rates = await fetchMCXRates();
  res.render('index', { rates });
});

app.get("/selling", async (req, res) => {
    const rates = await fetchMCXRates();
    res.render('sellingRates', { rates });
});

app.get("/buying", async (req, res) => {
    const rates = await fetchMCXRates();
    res.render('buyingRates', { rates });
});

app.get("/supplier", async (req, res) => {
    const rates = await fetchMCXRates();
    res.render('supplierRates', { rates });
});

app.get("/setting", async (req, res) => {
    const rates = await fetchMCXRates();
    res.render('setting', { rates });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
