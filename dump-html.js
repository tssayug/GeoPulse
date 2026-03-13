import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    try {
        console.log('Navigating to dashboard...');
        await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });

        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        console.log('--- BODY CONTENT START ---');
        console.log(bodyHTML);
        console.log('--- BODY CONTENT END ---');

        const rootExists = await page.evaluate(() => !!document.getElementById('root'));
        console.log('Root element exists:', rootExists);

        const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'ROOT EMPTY');
        console.log('--- ROOT CONTENT START ---');
        console.log(rootHTML);
        console.log('--- ROOT CONTENT END ---');

    } catch (e) {
        console.error('Scrape error:', e);
    } finally {
        await browser.close();
    }
})();
