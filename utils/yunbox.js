const fs = require('fs');
const https = require('https');
import path from 'path'

const publicDirectory = path.join(process.cwd(), 'public')

export async function downloadFile(url, subPath) {
    console.log(` * Downloading file: ${url}`);
    const dest = path.join(publicDirectory, subPath);
    if (fs.existsSync(dest)) {
      console.log(' * already exist');
      return;
    }
    const file = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                const filePath = fs.createWriteStream(dest);
                res.pipe(filePath)
                   .on('finish',() => {
                    console.log(' * Download Completed'); 
                    resolve();
                    })
                   .on('error', (error) => {
                    reject(error);
                    });
            });
    }).catch((error) => {
      console.log(` * ERROR: ${error}`);
    });
}