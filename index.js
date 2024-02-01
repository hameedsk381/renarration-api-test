const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 2000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/download', async (req, res) => {
    const { url } = req.body;
    const userAgent = req.headers['user-agent'];

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Set viewport based on the user agent
        if (userAgent.includes("Mobile")) {
            await page.setUserAgent(userAgent);
            await page.setViewport({ width: 480, height: 800 });
        } else if (userAgent.includes("Tablet")) {
            await page.setUserAgent(userAgent);
            await page.setViewport({ width: 768, height: 1024 });
        } else {
            await page.setUserAgent(userAgent);
            await page.setViewport({ width: 1920, height: 1080 });
        }

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Manipulate DOM: remove target attributes, adjust hrefs, and add data-ids
        await page.evaluate((baseUrl) => {
            document.querySelectorAll('a').forEach(a => {
                a.removeAttribute('target');
                if (a.getAttribute('href').startsWith('/')) {
                    a.href = baseUrl + a.getAttribute('href');
                }
                // Add more manipulation logic here if needed
            });
            document.querySelectorAll('svg').forEach(svg => {
                svg.style.maxWidth = '30px';
                svg.style.maxHeight = '30px';
            });
            document.querySelectorAll('*').forEach(el => {
                if (!el.getAttribute('data-id')) {
                    el.setAttribute('data-id', Math.random().toString(36).substr(2, 9));
                }
            });

            // Additional DOM manipulations can be added here
        }, url);

        const modifiedHtml = await page.content();
        await browser.close();

        res.header('Content-Type', 'text/html');
        res.send(modifiedHtml);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error processing request');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
