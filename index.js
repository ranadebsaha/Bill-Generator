const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.post('/generate-bill', async (req, res) => {
  try {
    const html = await ejs.renderFile(path.join(__dirname, 'views', 'index1.ejs'), {
      user: req.body 
    });

    const pdfname=req.body.shop_name+".pdf";
    const pdfPath = path.join(__dirname, pdfname);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: pdfPath, format: 'A4' });
    await browser.close();

    res.download(pdfPath);
  } catch (err) {
    console.error('Error generating invoice:', err);
    res.status(500).send('Something went wrong');
  }
});



app.listen(3000);
