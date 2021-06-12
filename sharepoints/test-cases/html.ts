import * as fs from 'fs';
import * as path from 'path';
import {Page} from 'puppeteer-core';
import {removeJavascriptFromHTML} from "../scripts-remover";
import {createDirectoryIfItDoesNotExist} from "../../utils";
import {SNAPSHOTS_DIRECTORY} from "../../constants";

const extractCSS = async (page: Page) => {
    return await page
        .evaluate(() => {
            return Array.from(document.styleSheets)
                .filter((styleSheet: CSSStyleSheet) => {
                    if (!styleSheet.href) {
                        return true;
                    }
                    return styleSheet.href.indexOf(window.location.origin) === 0;
                })
                .map((styleSheet: CSSStyleSheet) => {
                    const rules = Array.from(styleSheet.cssRules);
                    const cssContent = rules.map(rule => rule.cssText).join("\n");

                    return {
                        content: cssContent,
                        name: Date.now().toString(36) + Math.random().toString(36).substr(2)
                    }
                })
        });
}
export const run = async (page: Page, siteUrl: string, website: string, removeJS: boolean = false): Promise<void> => {
    // Create site page screenshot
    // const requestSharePoint = siteUrl.split("/")[siteUrl.split("/").length - 1].replace(/(:|\.)/g, '_');
    const dir = `${SNAPSHOTS_DIRECTORY}/${website}`;
    const htmlDir = `${dir}/html`;
    const styleDir = `${dir}/style`;
    const assetsDir = `${dir}/assets`;
    const jsStories = `${dir}/js-stories`;
    // Creating directories
    createDirectoryIfItDoesNotExist(dir);
    createDirectoryIfItDoesNotExist(htmlDir);
    createDirectoryIfItDoesNotExist(styleDir);
    createDirectoryIfItDoesNotExist(assetsDir);
    createDirectoryIfItDoesNotExist(jsStories);

    await page.exposeFunction('captureSnapshot', async (data: any) => {
        console.log('data [sharepoints/test-cases/html.ts]: ', data);

        const cssData = await extractCSS(page);
        for (let i = 0; i < cssData.length; i++) {
            const {content, name} = cssData[i];
           try {
               // fs.writeFileSync(`${styleDir}/${name}.css`, content);
               await page.addStyleTag({
                    content,
                   // path: `/snapshots/${website}/style/${name}.css`
               })
           } catch (e) {
               console.error('Error [html.ts]: ', e);
           }
        }
        console.log('css written successfully')
        const html = await page.content();

        let content: string = html;
        if (removeJS) {
            content = removeJavascriptFromHTML(html) || content;
        }
        const filename = new Date().toISOString().replace(/:/g, '$').replace(/\./g, '_');
        fs.writeFileSync(path.join(htmlDir, `${filename}.html`), content)

        const jsContent = `
        export const getTemplate = (args) => {
            return \`${content}\`
        }`;
        fs.writeFileSync(path.join(jsStories, `${filename}.js`), jsContent);
        console.log(`Hi developer you can get the template if you use the following link
        \n\n=======================================================================================\n
        ${
            path.join(jsStories, `${filename}.js`)
        }
        Inside loader:
        loaders: [async () => ({Component: await import('PATH_TO_PUBLIC/${path.join(jsStories, `${filename}.js`)}')})],
        \n\n=======================================================================================\n`);
        // const sbContent = `
        // const createWiki = (args) => {
        //     return \`${html}\`
        // }
        // export default {
        //     title: 'Example/Wiki',
        //     argTypes: {
        //     },
        // };
        // const Template = (args) => createWiki(args);
        // export const wikiPage = Template.bind({});
        // wikiPage.args = {...{a: '2', b: '3'}};
        // `
        // fs.writeFileSync('C:\\dev\\shortpoint\\storybook\\stories\\sbContent.stories.js', sbContent);

    });

    await page.evaluate(() => {
        window.addEventListener('takeSnapshot', (dd) => {
            console.log('Thrown data for event (takeSnapshot): ', dd);
            try {
                (window as any).captureSnapshot({a: 'whatever'});

            } catch (e) {
                console.log('e: ', e);
            }
        });
    });

    await page.addScriptTag({
        content: `
                function foo() {
                  // Create the event.
                  const event = new Event('takeSnapshot');
                  // target can be any Element or other EventTarget.
                  window.dispatchEvent(event);
                  console.log('event dispatched [html.ts local file]: ', event);
                }
        `,
        type: 'text/javascript'
    });


    await page.evaluate(() => {
        const snapshotBtn = "<button style= id='snapshotBtn' class='snapshot-btn' onclick='foo()'>capture snapchat</button>";
        const body = document.getElementsByTagName('body')[0];
        const btn = document.createElement('button');
        btn.id = 'snapshotBtn';
        btn.setAttribute('onclick', 'foo()');
        btn.innerText = 'capture';
        btn.style.cssText = 'position: absolute; color: white; text-align: center; right: 0; width: 60px; height: 60px; z-index: 5000000000; top: 0; background-color: #0C9;border-radius:50px;';
        // btn.innerHTML = snapshotBtn;
        body.appendChild(btn);
        // body.innerHTML = snapshotBtn + body.innerHTML;
    })
};
