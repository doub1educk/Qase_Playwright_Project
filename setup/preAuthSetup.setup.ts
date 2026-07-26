import {chromium} from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import {LoginPage} from '../pages/loginPage';

dotenv.config({path: path.resolve(__dirname, '.env')});
const envFile = process.env.ENV_FILE ?? 'qa.local.env';
dotenv.config({path: path.resolve(__dirname, `envs/${envFile}`)});

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(process.env.BASE_URL + '/login');
    await page.locator('#accept').click();

    const loginPage = new LoginPage(page);
    await loginPage.fillEmailInput(process.env.LOGIN_EMAIL!);
    await loginPage.fillPasswordInput(process.env.LOGIN_PASSWORD!);

    const [response] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/v1/auth/login') && res.request().method() === 'POST'),
        loginPage.clickLoginButton()
    ]);

    if (response.status() !== 200 && response.status() !== 204) {
        throw new Error(`Auth setup failed, status: ${response.status()}`);
    }

    await page.context().storageState({path: '.auth/preAuthSetup.json'});
    await browser.close();
})();