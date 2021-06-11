import * as fs from "fs";


export const createDirectoryIfItDoesNotExist = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
    }
}


export const sameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
