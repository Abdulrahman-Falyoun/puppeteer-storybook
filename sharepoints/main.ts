import * as puppeteer from 'puppeteer';
import * as minimist from 'minimist';
import {config} from 'dotenv';
import {authPuppeteer} from './authentication';
import {SharePoints} from "./share-points-names";

interface IArgs {
    headless?: boolean;
    configPath?: string;
    scenarios?: string;
    executablePath?: string;
    removeJS?: boolean;
    website?: string;
}

config(); // parse local .env if any
const {headless, configPath, executablePath, removeJS, website} = minimist(process.argv.slice(2)) as IArgs;

if (!website || SharePoints.indexOf(website) === -1) {
    throw new Error(`Website's name is required and it should be one of the values [${SharePoints}]`)
}
(async () => {

    // Optional window and viewport dimensions config
    const width = 1920;
    const height = 1080;

    console.time('Execution time');
    const browser = await puppeteer.launch({
        headless: headless ? JSON.parse(headless as any) : false,
        args: [`--window-size=${width},${height}`],
        timeout: 0,
        executablePath: executablePath || 'C:\\Users\\JS\\Downloads\\chrome-win\\chrome.exe'
    });

    console.log('browser launched')
    try {

        const page = await browser.newPage();
        const siteUrl = await authPuppeteer(page, configPath);

        await page.setViewport({width, height});
        await page.goto(siteUrl, {
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 0
        });
        const runScenarios = ['html'];
        for (const runPath of runScenarios) {
            try {
                console.log('running ', runPath);
                const {run} = await import(`./test-cases/${runPath}`);
                await run(page, siteUrl, website, JSON.parse(removeJS as any));
            } catch (ex) {
                console.log(`Error: ${ex.message}`);
            }
        }

    } catch (ex) {
        console.log(`Error: ${ex.message}`);
    } finally {
        // await browser.close();
    }

    console.timeEnd('Execution time');
})()
    .catch(console.warn);
