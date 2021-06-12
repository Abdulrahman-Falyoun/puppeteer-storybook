
import * as cheerio from 'cheerio';


export const injectHTML = (html: string, selector: string, content: string) => {
    const $ = cheerio.load(html);
    const selectedDOMElement = $(selector);
    selectedDOMElement.html(selectedDOMElement.html() + content);
    return $.html();
}


//
// (() => {
//     const newContent = injectHTML(`<!doctype html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport"
//           content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
//     <meta http-equiv="X-UA-Compatible" content="ie=edge">
//     <title>Document</title>
// </head>
// <body>
//
//     <div id="unique_id"></div>
// </body>
// </html>`, `#unique_id`, 'Hi div content');
//
//
//     console.log('new content: ', newContent);
// })();
