import * as puppeteer from 'puppeteer';
import * as minimist from 'minimist';
import {config} from 'dotenv';
import {authPuppeteer} from './authentication';
import {SharePointsNames} from "./share-points-names";

interface IArgs {
    headless?: boolean;
    configPath?: string;
    executablePath?: string;
    removeJS?: boolean;
    website?: typeof SharePointsNames[number];
    snapshot?: boolean;
}

config(); // parse local .env if any
const {headless, configPath, executablePath, removeJS, website, snapshot} = minimist(process.argv.slice(2)) as IArgs;

if (!website || SharePointsNames.indexOf(website) === -1) {
    throw new Error(`Website's name is required and it should be one of the values [${SharePointsNames}]`)
}


const takeSnapshot = async () => {
    // Optional window and viewport dimensions config
    const width = 1920;
    const height = 1080;

    const browser = await puppeteer.launch({
        headless: headless ? JSON.parse(headless as any) : false,
        args: [`--window-size=${width},${height}`],
        timeout: 0,
        executablePath: executablePath || 'C:\\Users\\JS\\Downloads\\chrome-win\\chrome.exe'
    });

    const page = await browser.newPage();
    const siteUrl = await authPuppeteer(page, configPath);

    await page.setViewport({width, height});
    await page.goto(siteUrl, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 0
    });

    console.log('browser launched')
    try {


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
}


(async () => {

    console.time('Execution time');
    if (JSON.parse(snapshot as any) === true) {
        await takeSnapshot();
    } else {

    }
    console.timeEnd('Execution time');
})()
    .catch(console.warn);