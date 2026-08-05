import {expect} from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/loginPage';
import { randomPassword } from '../utils/randomData';
import { test } from '../fixtures/fixtures';
import {ProjectsPage} from '../pages/projectsPage';

const { When, Then, Given } = createBdd(test);

Given('I am on the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.openLoginPage();
});

When('I enter email from ENV file', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillEmailInput(process.env.LOGIN_EMAIL!);
});

When('I enter password from ENV file', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillPasswordInput(process.env.LOGIN_PASSWORD!);
});

When('I click on the login button with correct credentials', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    const loginPage = new LoginPage(page);
    const [response] = await Promise.all([
    projectsPage.waitForProjectListLoad(),  
    loginPage.clickLoginButton()             
]);
});

When('I click on the login button with incrorect credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    loginPage.clickLoginButton()             
});

Then('I should be on the projects page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.page).toHaveURL(/.*\/projects/);;
});

When('I enter wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillPasswordInput(randomPassword());
});

Then('I should stay on the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.page).toHaveURL('/login');
});

Then('I should see login error alert {string}', async ({ page }, text: string) => {
    const loginPage = new LoginPage(page);
    await expect(loginPage.loginErrorAlert).toHaveText(text)
    console.log('Error: 2 alerts, when we try to login with incorrect password');
});
