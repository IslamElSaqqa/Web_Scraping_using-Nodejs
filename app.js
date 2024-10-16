// Get the Modules
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use(express.json());
////////////////////////////////////////////////////////////



// Scrap Cairo Cart

async function scrapeCairoCart(productName) {
    try {
        const url = `https://cairocart.com/en/catalogsearch/result/?q=${encodeURIComponent(productName)}`;
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        };

        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);
        const products = [];

        $('.product-item').each((index, element) => {
            const title = $(element).find('.product-item-name').text().trim() || 'N/A';
            const newPrice = $(element).find('span.price').text().trim() || 'N/A';
            const newPriceSplit = newPrice.split(/(?<=\d)(?=EGP)/);
            const newPriceAfterSplt = newPriceSplit[0];
            const oldPrice = $(element).find('.old-price').text().trim() || 'N/A'; // Assuming '.old-price' contains the old price
            const link = $(element).find('a').attr('href');
    

            products.push({
                title,
                price: newPriceAfterSplt, // Current price
                priceBeforeDiscount: oldPrice, // Old price
                link
            });
        });

        return products;
    } catch (error) {
        console.error('Error scraping CairoCart:', error);
        return [];
    }
}


async function scrapeAmazon(productName) {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(productName)}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  };

  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const products = [];

    $('.s-result-item').each((index, element) => {
        const title = $(element).find('span.a-size-medium.a-color-base.a-text-normal').text().trim() || 'N/A';
        const symbol = $(element).find('span.a-price-symbol').text().trim() || '';
        const newPriceWhole = $(element).find('span.a-price-whole').text().trim();
        const newPriceFraction = $(element).find('span.a-price-fraction').text().trim();
        const newPrice = newPriceWhole ? symbol+newPriceWhole + newPriceFraction : 'N/A';
        const oldPrice = $(element).find('span.a-text-price span.a-offscreen').text().trim() || '';
        const link = $(element).find('a.a-link-normal').attr('href');

      if (title && link) {
        products.push({
          title,
          price: newPrice,
          priceBeforeDiscount: oldPrice,
          link: `https://www.amazon.com${link}`
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    return [];
  }
}
































const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Home Route
app.get('/', (req, res) => {
    res.render('home'); // Ensure home.ejs exists in the views directory
});

// Search Route
app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required.' });
    }

    const results = {
        Amazon: await scrapeAmazon(query),
        CairoCart: await scrapeCairoCart(query),
        // Noon: await scrapeNoon(query)
    };

    res.json(results);
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
