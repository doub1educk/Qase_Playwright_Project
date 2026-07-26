import { createBdd } from 'playwright-bdd';
import { ProjectsPage } from '../pages/projectsPage';
import { randomProjectTitle, randomProjectCode,randomSuiteTitle } from '../utils/randomData';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';

const { When, Then, Given } = createBdd(test);

Given('project has been creating via API',async ({apiClient, testContext}) => {
    const title = randomProjectTitle();
    const code = randomProjectCode();

    await apiClient.createProject(title, code);

    testContext.set('projectCode', code);
    testContext.set('projectTitle', title);
});

When('I open the created project', async ({page, testContext}) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.gotoSpecificProject(testContext.get<string>('projectCode'));
});

When('I click button to creating a new suite', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.clickCreateNewSuiteButton();
});

When('I enter a title of suite', async ({ page, testContext }) => {
    const suiteTitle = randomSuiteTitle();
    testContext.set('suiteTitle', suiteTitle);

    const projectsPage = new ProjectsPage(page);
    await projectsPage.fillSuiteNameInput(testContext.get<string>('suiteTitle'));
});

When('I click button to submit creating testCase', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.clickCreateSuiteButton();
});

Then('Suite should be appears in the suites list', async ({ page, testContext }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.checkSuiteVisible(testContext.get<string>('suiteTitle'));
});

Then('Suite should exist according to API', async ({ apiClient, testContext }) => {
    const projectCode = testContext.get<string>('projectCode');
    const suiteTitle = testContext.get<string>('suiteTitle');

    const suites = await apiClient.getSuites(projectCode);
    const createdSuite = suites.find((s: any) => s.title === suiteTitle);

    expect(createdSuite, `Suite "${suiteTitle}" was not found`).toBeDefined();
    expect(createdSuite.title).toEqual(suiteTitle);
});





