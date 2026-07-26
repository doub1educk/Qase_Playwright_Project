import {chromium} from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '.env')});
const envFile = process.env.ENV_FILE ?? 'qa.local.env';
dotenv.config({path: path.resolve(__dirname, `envs/${envFile}`)});

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(process.env.BASE_URL + '/login');
    await page.locator('#accept').click();

    await page.context().storageState({path: '.auth/privacyAcceptOnly.json'});
    await browser.close();
})();