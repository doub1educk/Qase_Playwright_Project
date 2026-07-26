import {expect} from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { ProjectsPage } from '../pages/projectsPage';
import { randomProjectTitle, randomProjectCode } from '../utils/randomData';
import { test } from '../fixtures/fixtures';

const { When, Then, Given } = createBdd(test);

Given('Random data has been prepared for the new project', async ({ testContext }) => {
    testContext.set('projectTitle', randomProjectTitle());
    testContext.set('projectCode', randomProjectCode());
});

Given('I am on the project page', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.gotoProjectPage();
})

When('I click button to creating a new project', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.clickCreateNewProjectButton();
});

When('I enter a title of project', async ({ page, testContext }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.fillProjectNameInput(testContext.get<string>('projectTitle'));
});

When('I enter a code for project', async ({ page, testContext }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.fillProjectCodeInput(testContext.get<string>('projectCode'));
});

When('I click button to submit creating', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.clickSubmitCreatingProjectButton();
});

Then('Project should be appears in the project list', async ({ page, testContext }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.expectProjectVisible((testContext.get<string>('projectCode')));
});

Then('I should be on the page of the created project', async ({ page, testContext }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.checkSpecificProjectUrl(testContext.get<string>('projectCode'));
});

When('I click on the projects button in header', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    const [response] = await Promise.all([
    projectsPage.waitForProjectListLoad(),
    await projectsPage.clickProjectsButtonInHeader()
    ]);
});
