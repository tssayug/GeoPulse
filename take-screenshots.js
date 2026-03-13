import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    const shotDir = 'c:/Users/tssay/VSCode/RA Projects/National emergencies/screenshots';

    try {
        console.log('Navigating to http://localhost:5173/ ...');
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `${shotDir}/home.png` });
        console.log('Home screenshot saved.');

        console.log('Navigating to http://localhost:5173/dashboard ...');
        await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `${shotDir}/dashboard.png` });
        console.log('Dashboard screenshot saved.');
    } catch (e) {
        console.error('Error during screenshots:', e);
    } finally {
        await browser.close();
    }
})();
