import * as cheerio from 'cheerio';
import * as fs from 'fs';


export const removeJavascriptFromHTML = (html?: string, path?: string) => {
    if (!html && !path) {
        throw new Error(`No html content received`);
    }
    let contentToParse: string = html ? html : fs.readFileSync(path || '<script></script>>', {encoding: 'utf-8'});
    const $ = cheerio.load(contentToParse);
    return $('html').clone().find("script,noscript").remove().end().html();
}





