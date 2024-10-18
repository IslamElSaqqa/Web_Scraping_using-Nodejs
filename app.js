// Get the Modules
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine and views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static('public'));
app.use(express.json());
////////////////////////////////////////////////////////////
async function scrapeShikoStore(productName) {
  const baseUrl = 'https://shikostore.com/search?type=product&q=';
  const url = `${baseUrl}${encodeURIComponent(productName)}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(response.data); // Log the response to debug

    const $ = cheerio.load(response.data);
    const products = [];

    // Adjust selectors based on the actual HTML structure of the Shiko store website
    $('.product-item').each((index, element) => {
      const title = $(element).find('a.product-item__title').text().trim() || 'N/A';
      const newPrice = $(element).find('.price').first().text().trim() || 'N/A';
      const oldPrice = $(element).find('.price').text().trim() || 'N/A';
      const link = $(element).find('a.product-item__title').attr('href');

      console.log({ title, newPrice, oldPrice, link }); // Log product details

      if (title && link) {
        products.push({
          title,
          price: newPrice,
          priceBeforeDiscount: oldPrice,
          link: link ? `https://shikostore.com${link}` : '', // we have to append the product link manually
        });
      }
    });

    return products.length > 0 ? products : 'No products found.';
  } catch (error) {
    console.error('Error scraping Shiko Store:', error);
    return [];
  }
}
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


// Scrap Amazon
async function scrapeAmazon(productName) {
  const url = `https://www.amazon.eg/s?k=${encodeURIComponent(productName)}&language=en`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  };

  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const products = [];

    $('.s-result-item').each((index, element) => {
        const title = $(element).find('.a-size-base-plus').text().trim() || 'N/A';
        const symbol = $(element).find('span.a-price-symbol').text().trim() || '';
        const newPriceWhole = $(element).find('span.a-price-whole').text().trim();
        const newPriceFraction = $(element).find('span.a-price-fraction').text().trim();
        const newPrice = newPriceWhole ? symbol+" "+newPriceWhole + newPriceFraction : 'No offers';
        const oldPrice = $(element).find('span.a-text-price span.a-offscreen').text().trim() || '';
        const link = $(element).find('a.a-link-normal').attr('href');

      if (title && link) {
        products.push({
          title,
          price: newPrice,
          priceBeforeDiscount: oldPrice,
          link: `https://www.amazon.eg${link}`
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Error scraping Amazon:', error);
    return [];
  }
}
// scrap Tech valley
const puppeteer = require('puppeteer');
async function scrapeTechnologyValley(productName) {
  const url = `https://tv-it.com/products?categories[]=0&q=${encodeURIComponent(productName)}`;

  // Launch a headless browser
  const browser = await puppeteer.launch({ headless: true,executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" });
  const page = await browser.newPage();

  try {
    // Set the user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');
    // Navigate to the URL and wait for the page to fully load
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract product data
    const products = await page.evaluate(() => {
      const items = [];
      const productElements = document.querySelectorAll('.ps-product');

      productElements.forEach(element => {
        const title = element.querySelector('.ps-product__title')?.innerText.trim() || 'N/A';
        const newPrice = element.querySelector('.ps-product__price.sale')?.childNodes[0]?.nodeValue.trim() || 'N/A';
        const oldPrice = element.querySelector('.ps-product__price del')?.innerText.trim() || 'N/A';
        const link = element.querySelector('.ps-product__title')?.href || 'N/A';

        if (title) {
          items.push({
            title,
            price: newPrice,
            priceBeforeDiscount: oldPrice,
            link: link
          });
        }
      });
      return items;
    });

    // Log the extracted product data
    console.log('Extracted Products:', products);
    return products;

  } catch (error) {
    console.error('Error scraping Technology Valley:', error);
    return [];
  } finally {
    await browser.close(); // Ensure the browser is closed after scraping
  }
}
// Scraping Baraka website
async function scrapeBarakaStore(productName) {
  const url = `https://barakacomputer.net/?s=${encodeURIComponent(productName)}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  };

  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const products = [];
    
    $('.products .product').each((index, element) => {
      const title = $(element).find('.woocommerce-loop-product__title').text().trim() || 'N/A';
      // const symbol = $(element).find('.woocommerce-Price-currencySymbol').text().trim() || 'EGP';
      const newPrice = $(element).find('span.woocommerce-Price-amount.amount').last().text().trim()+' '|| 'N/A';
      const oldPrice = ($(element).find('span.woocommerce-Price-amount.amount').first().text().trim())+' ' || 'N/A';
      const link = $(element).find('.product-item .info a').attr('href');
      products.push({
        title,
        price: newPrice,
        priceBeforeDiscount: oldPrice,
        link: link
      });
    });
    return products;
  } catch (error) {
    console.error('Error scraping Baraka Store:', error);
    return [];
  }
}
async function scrapeCairoSales(productName) {
  const url = `https://cairosales.com/en/find?search_query=${encodeURIComponent(productName)}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  };

  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const products = [];
    
    $('.product-container').each((index, element) => {
      const title = $(element).find('h5').text().trim() || 'N/A';
      const newPrice = $(element).find('.price').first().text().trim()|| 'No sales price';
      const oldPrice = ($(element).find('.old-price').first().text().trim());
      const link = $(element).find('.product-name').attr('href');
      products.push({
        title,
        price: newPrice,
        priceBeforeDiscount: oldPrice,
        link: link ? link : 'Sorry undefined Link'
      });
    });
    return products
  } catch (error) {
    console.error('Error scraping Cairo sales Store:', error);
    return [];
  }
}






// Scraping maximum hardware website
async function scrapeMaxHardware(productName) {
  const url = `https://maximumhardware.store/index.php?route=product/search&search=${encodeURIComponent(productName)}`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
  };

  try {
    const response = await axios.get(url, { headers });
    const $ = cheerio.load(response.data);
    const products = [];
    
    $('.main-products .product-thumb').each((index, element) => {
      const title = $(element).find('.name a').text().trim() || 'N/A';
      const newPrice = $(element).find('.price-normal').text().trim() || 'N/A';
      const oldPrice = $(element).find('.price-normal').text().trim() || 'N/A';
      const link = $(element).find('.name a').attr('href');

      products.push({
        title,
        price: newPrice,
        priceBeforeDiscount: oldPrice,
        link: link
      });
    });

    await writeToCsv(products);
    return products;
  } catch (error) {
    console.error('Error scraping Max Hardware:', error);
    return [];
  }
}

async function writeToCsv(products) {
  const csvWriter = createCsvWriter({
    path: 'products.csv',
    header: [
      { id: 'title', title: 'Title' },
      { id: 'price', title: 'New Price' },
      { id: 'priceBeforeDiscount', title: 'Old Price' },
      { id: 'link', title: 'Link' }
    ]
  });

  try {
    await csvWriter.writeRecords(products);
    console.log('CSV file written successfully');
  } catch (error) {
    console.error('Error writing CSV file:', error);
  }
}



////////////////



///////////////
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
        // Cairo_Cart: await scrapeCairoCart(query),
        // shiko_Store: await scrapeShikoStore(query),
        // maximum_Hardware: await scrapeMaxHardware(query),
        // Technology_Valley: await scrapeTechnologyValley(query),
        Baraka_Store: await scrapeBarakaStore(query),
        Cairo_Sales: await scrapeCairoSales(query)
    };

    res.json(results);
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
