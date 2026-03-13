import puppeteer from 'puppeteer';

(async () => {
    console.log('Starting puppeteer to capture console logs from http://localhost:5173/');

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Capture all console messages
    page.on('console', msg => {
        console.log(`BROWSER CONSOLE [${msg.type().toUpperCase()}]: ${msg.text()}`);
        if (msg.type() === 'error') {
            const loc = msg.location();
            console.log(`Error Location: ${loc.url}:${loc.lineNumber}:${loc.columnNumber}`);
        }
    });

    // Capture page errors (uncaught exceptions)
    page.on('pageerror', err => {
        console.log(`BROWSER ERROR: ${err.message}`);
    });

    try {
        const response = await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0', timeout: 10000 });
        console.log(`Page navigation complete. Status: ${response?.status()}`);

        // Wait a bit just in case
        await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
        console.error('Failed to load page:', error);
    } finally {
        await browser.close();
    }
})();
