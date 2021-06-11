import {SharePointsNames} from "../sharepoints/share-points-names";
import {SNAPSHOTS_DIRECTORY} from "../constants";
import { getTemplate } from '../public/snapshots/wiki/js-stories/2021-06-10T20$45$38_308Z';
export const getStorybookHTML =  (website: typeof SharePointsNames[number], date: Date) => {
    const htmlDir = `${SNAPSHOTS_DIRECTORY}/${website}/js-stories`;
    // return import(`${htmlDir}/${date.toISOString().replace(/:/g, '$').replace(/\./g, '_')}`);
    console.log( import('../public/snapshots/wiki/js-stories/2021-06-10T20$45$38_308Z'))
    console.log('`.${htmlDir}/2021-06-10T20$45$38_308Z`: ', `.${htmlDir}/2021-06-10T20$45$38_308Z`)
    // return await import(`.${htmlDir}/2021-06-10T20$45$38_308Z`);
    const d =  import('../public/snapshots/wiki/js-stories/2021-06-10T20$45$38_308Z');
    console.log('d: ', d);
    return d;
    // const htmlDir = `${SNAPSHOTS_DIRECTORY}/${website}/html`;
    // const files = fs.readdirSync(htmlDir);
    // for(let i = 0; i < files.length; i++) {
    //     const d = files[i].replace(/\$/g, ':').replace(/\_/g, '.')
    //     const hasSameDay = sameDay(new Date(d), date);
    //     if(hasSameDay) {
    //         return import(`${htmlDir}/${files[i]}`);
    //     }
    // }
    //
    // throw new Error(`There's no snapshot in the specified date`);
};