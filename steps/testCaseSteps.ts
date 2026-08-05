import { createBdd, DataTable } from 'playwright-bdd';
import { ProjectsPage } from '../pages/projectsPage';
import { test } from '../fixtures/fixtures';
import { expect } from '@playwright/test';
import { randomSuiteTitle,randomTestCaseTitle } from '../utils/randomData';
import { TestCasePage } from '../pages/testCasePage';
import { createTestFile } from '../utils/randomFile';
import type { Response } from '@playwright/test';
import { TEST_CASE_FIELD_LABELS } from '../constants/testCaseFields';
import{CONTEXT_KEYS} from '../constants/contextKeys';

const { When, Then, Given } = createBdd(test);

Given('suite has been creating via API',async ({apiClient, testContext}) => {
    const projectCode = testContext.get<string>(CONTEXT_KEYS.PROJECT_CODE);
    const suiteTitle = randomSuiteTitle();
    const suite = await apiClient.createSuite(projectCode, suiteTitle);
    testContext.set(CONTEXT_KEYS.SUITE_ID, suite.id);
    testContext.set(CONTEXT_KEYS.SUITE_TITLE, suiteTitle);
})

When('I open created suite', async ({ page, testContext }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.clickOnSpecificSuite(testContext.get<string>(CONTEXT_KEYS.SUITE_TITLE));
});

When('I click on dropdown menu', async ({ page,testContext }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.clickOnTestSuiteDropdownMenu(testContext.get<string>(CONTEXT_KEYS.SUITE_TITLE));
})

When('I click button to create new testCase', async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.clickOnButtonToCreateNewTestCase();
});

When('I enter a random title of testCase', async ({ page, testContext }) => {
    const testCasePage = new TestCasePage(page);
    const TestCaseTitle = randomTestCaseTitle();
    testContext.set(CONTEXT_KEYS.TEST_CASE_TITLE, TestCaseTitle);
    await testCasePage.fillTestCaseTitle(TestCaseTitle);
});

When('I select status {string} and severity {string} and priority {string} and type {string} and layer {string} and is flaky {string} and behavior {string} and automation status {string}', async ({ page, testContext }, status, severity, priority, type, layer, isFlaky, behavior, automationStatus) => {
    testContext.set(CONTEXT_KEYS.TEST_CASE_FIELDS, {status, severity, priority, type, layer, isFlaky, behavior, automationStatus});

    const testCasePage = new TestCasePage(page);
    await testCasePage.selectFromDropDown(TEST_CASE_FIELD_LABELS.STATUS, status);
    await testCasePage.selectFromDropDown(TEST_CASE_FIELD_LABELS.SEVERITY, severity);
    await testCasePage.selectFromDropDown(TEST_CASE_FIELD_LABELS.PRIORITY, priority);
    await testCasePage.selectFromDropDown(TEST_CASE_FIELD_LABELS.TYPE, type);
    await testCasePage.selectFromDropDown(TEST_CASE_FIELD_LABELS.LAYER, layer);
    await testCasePage.selectFromDropDown(TEST_CASE_FIELD_LABELS.IS_FLAKY, isFlaky);
    await testCasePage.selectFromDropDown(TEST_CASE_FIELD_LABELS.BEHAVIOR, behavior);
    await testCasePage.selectFromDropDown(TEST_CASE_FIELD_LABELS.AUTOMATION_STATUS, automationStatus);
});

When('I enable checkbox {string}', async ({ page }, checkbox) => {
    const testCasePage = new TestCasePage(page);
    await testCasePage.enableCheckbox(checkbox);
});

When('I fill testCase steps:',async ({ page, testContext }, table:DataTable) => {
    const steps = table.hashes();
    testContext.set(CONTEXT_KEYS.TEST_CASE_STEPS, steps);

    const testCasePage = new TestCasePage(page);
    const createdFilePaths: string[] = [];

    for (let i=0; i<steps.length; i++){
        const step = steps[i];
        await testCasePage.addNewTestCaseStep();
        await testCasePage.fillStepAction(i, step.action);
        await testCasePage.fillStepExpectedResult(i, step.expected_result);
        if (step.data){
            if (step.data.match(/\.(txt|jpg|jpeg)$/i)){
                const filePath = await createTestFile();
                createdFilePaths.push(filePath);
                await testCasePage.uploadFileForStep(i, filePath!);
            } else{
                await testCasePage.fillStepData(i, step.data);
            }
        }
    }
    testContext.set('createdFilePaths', createdFilePaths)
});

When('I click button to save testCase', async ({ page,testContext }) => {
    const testCasePage = new TestCasePage(page);
    const [testCaseLoadResponse] = await Promise.all([
    testCasePage.waitForTestCaseDetailsResponse(),
    testCasePage.clickSaveTestCaseButton()
    ]);
        testContext.set(CONTEXT_KEYS.TEST_CASE_LOAD_RESPONSE, testCaseLoadResponse);
});

Then('testCase details should match according to API', async ({ apiClient, testContext }) => {
    const response = testContext.get<Response>(CONTEXT_KEYS.TEST_CASE_LOAD_RESPONSE);
    expect(response.status()).toBe(200);

    const body = await response.json();
    const caseData = body.case;

    const expectedTitle = testContext.get<String>(CONTEXT_KEYS.TEST_CASE_TITLE);
    const expectedSteps = testContext.get<Array<{action: string, expected_result: string, data: string}>>(CONTEXT_KEYS.TEST_CASE_STEPS);

    expect(caseData.title).toEqual(expectedTitle);
    expect(caseData.steps).toHaveLength(expectedSteps.length);
    expect(caseData.isToBeAutomated).toEqual(true);

    expectedSteps.forEach((expectedSteps,index) => {
        expect(caseData.steps[index].action).toEqual(expectedSteps.action);
        expect(caseData.steps[index].expected_result).toEqual(expectedSteps.expected_result);
    });
});

When('I enable checkbox Shown as list', async ({ page }) => {
    const testCasePage = new TestCasePage(page);
    await testCasePage.clickShowAsListButton();
});

Then('Test case steps should be correct in UI', async ({ page, testContext }) => {
    const testCasePage = new TestCasePage(page);

    const steps = testContext.get<Array<{action: string, expected_result: string, data: string}> >(CONTEXT_KEYS.TEST_CASE_STEPS);
    for(const step of steps){
        await testCasePage.checkStepVisible(step.action, step.expected_result);
    }
});

When('I come to property page of testCase', async ({ page }) => {
    const testCasePage = new TestCasePage(page);
    await testCasePage.clickPropertyButton();
});

Then('Test case details should be correct in UI', async ({ page, testContext }) => {
    const testCasePage = new TestCasePage(page);

    const fields = testContext.get<{status: string, severity: string, priority: string, type: string, layer: string, isFlaky: string, behavior: string}>(CONTEXT_KEYS.TEST_CASE_FIELDS);

    await testCasePage.expectFieldValue(TEST_CASE_FIELD_LABELS.STATUS, fields.status);
    await testCasePage.expectFieldValue(TEST_CASE_FIELD_LABELS.PRIORITY, fields.priority);
    await testCasePage.expectFieldValue(TEST_CASE_FIELD_LABELS.SEVERITY, fields.severity);
    await testCasePage.expectFieldValue(TEST_CASE_FIELD_LABELS.TYPE, fields.type);
    await testCasePage.expectFieldValue(TEST_CASE_FIELD_LABELS.BEHAVIOR, fields.behavior);
    await testCasePage.expectFieldValue(TEST_CASE_FIELD_LABELS.IS_FLAKY, fields.isFlaky);
    await testCasePage.expectFieldValue(TEST_CASE_FIELD_LABELS.LAYER, fields.layer);
    await testCasePage.expectCheckboxChecked(TEST_CASE_FIELD_LABELS.TO_BE_AUTOMATED);

    });