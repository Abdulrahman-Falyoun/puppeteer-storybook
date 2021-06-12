import * as puppeteer from 'puppeteer';
import * as minimist from 'minimist';
import {config} from 'dotenv';
import {authPuppeteer} from './authentication';
import {SharePointsNames} from "./share-points-names";
import * as fs from 'fs';
import {SNAPSHOTS_DIRECTORY} from "../constants";

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
    const siteUrl = await authPuppeteer(page, website, configPath);

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

const consumeAlreadySnapshot = (website: typeof SharePointsNames[number]) => {
    const dir = `${SNAPSHOTS_DIRECTORY}/${website}/js-stories/`;
    const files = fs.readdirSync(dir);
    const sortedFiles = files.sort((a, b) => fs.statSync(dir + b).mtime.getTime() - fs.statSync(dir + a).mtime.getTime());
    const response = sortedFiles.map(file => {
        const parseFileNameToString = file.substr(0, file.indexOf(".")).replace(/\$/g, ':').replace(/_/g, '.');
        const loader = `async () => ({SharePointTemplate: await import('/${SNAPSHOTS_DIRECTORY}/${website}/js-stories/${file}')})`;
        return {
            snapshot: file,
            website,
            date: new Date(parseFileNameToString).toLocaleString(),
            loader,

        }
    })
    console.log("\n======================================================================\n\n");
    console.table(response, [
        'snapshot',
        'website',
        'date',
        'loader'
    ]);
    console.log("Usage: ")
    console.log(`
        export default {
            title: 'Example/SomeStorybook',
            loaders: [loader goes here],
        };
        export const Template = (args, {loaded}) => {
            const sharePointTemplate = loaded.SharePointTemplate.getTemplate({});
            console.log('sharePointTemplate: ', sharePointTemplate);
            return sharePointTemplate;
        };`
    )
    console.log("\n======================================================================\n\n");

}
(async () => {

    console.time('Execution time');
    if (JSON.parse(snapshot as any) === true) {
        await takeSnapshot();
    } else {
        consumeAlreadySnapshot(website);
    }
    console.timeEnd('Execution time');
})()
    .catch(console.warn);