import {Locator,expect,Page} from '@playwright/test';

export class TestCasePage{
    readonly page: Page
    readonly testCaseTitleInput: Locator
    readonly testCaseStatusDropDown: Locator
    readonly newTestCaseStepButton: Locator
    readonly uploadFileDropZone: Locator
    readonly saveTestCaseButton: Locator
    readonly propertyButton: Locator
    readonly showAsListButton: Locator
    constructor(page:Page){
        this.page = page
        this.testCaseTitleInput = page.getByPlaceholder('For example: Authorization');
        this.testCaseStatusDropDown = page.locator('[role= "combobox"]').filter({hasText: 'Actual'});
        this.newTestCaseStepButton = page.getByRole('button', { name: 'New step' });
        this.uploadFileDropZone = page.locator('form[enctype="multipart/form-data"]');
        this.saveTestCaseButton = page.locator("#save-case");
        this.propertyButton = page.getByRole('button', { name: 'Properties' });
        this.showAsListButton = page.locator('[data-sentry-element="Switch"]');
    }

    async fillTestCaseTitle(testCaseTitle: string){
        await this.testCaseTitleInput.fill(testCaseTitle);
    }

    async selectFromDropDown(fieldLabel: string, optionText: string) {
        const label = this.page.getByText(fieldLabel, { exact: true });
        const targetId = await label.getAttribute('for');

        const combobox = this.page.locator(`[id="${targetId}"]`);
        await combobox.click();

        const listboxId = await combobox.getAttribute('aria-controls');
        const listbox = this.page.locator(`[id="${listboxId}"]`);;

        await listbox.getByRole('option', { name: optionText }).click();
    }
    
    async enableCheckbox(fieldLabel: string){
        const label = this.page.getByText(fieldLabel, { exact: true });
        const checkmark = label.locator('[data-sentry-component="Checkmark"]');
        await checkmark.click();
    }

    async addNewTestCaseStep(){
        await this.newTestCaseStepButton.click();
    }

    async fillStepAction(index: number,action: string){
        const container = this.page.locator(`div[id ="edit-step-${index}"]`);
        const actionInput = container.locator('[data-placeholder="Step action"]');
        await actionInput.fill(action);
    }

    async fillStepExpectedResult(index: number,expectedResult: string){
        const container = this.page.locator(`div[id="edit-step-${index}"]`);
        const expectedResultInput = container.locator('[data-placeholder="Expected result"]');
        await expectedResultInput.fill(expectedResult);
    }

    async fillStepData(index: number, data: string){
        const container = this.page.locator(`div[id="edit-step-${index}"]`);
        const dataInput = container.locator('[data-placeholder="Data"]');
        await dataInput.fill(data);
    }

    async uploadFileForStep(index: number, filePath: string){
        const container = this.page.locator(`div[id="edit-step-${index}"]`);
        const fileInputButton = container.locator('[data-icon="image"]');
        await fileInputButton.click()
        const fileInput = this.page.locator('input[type="file"]');
        await fileInput.setInputFiles(filePath);
    }

    async clickSaveTestCaseButton(){
        await this.saveTestCaseButton.click();
    }

    waitForTestCaseDetailsResponse() {
        return this.page.waitForResponse(
            res => res.url().includes(`/case/load`) && res.request().method() === 'POST'
        );
    }

    async clickPropertyButton(){
        await this.propertyButton.click();
    }
    async expectFieldValue(fieldLabel: string, expectedValue: string) {
    const label = this.page.getByText(fieldLabel, { exact: true });
    const targetId = await label.getAttribute('for');
    const combobox = this.page.locator(`[id="${targetId}"]`);
    
    await expect(combobox).toContainText(expectedValue);
}

async expectCheckboxChecked(label: string) {
    await expect(this.page.getByLabel(label, { exact: true })).toBeChecked();
}

async clickShowAsListButton() {
    await this.showAsListButton.click();
}

async checkStepVisible(action: string, expectedResult: string){
    await expect(this.page.getByText(action,{exact: true})).toBeVisible();
    if (expectedResult){
        await expect(this.page.getByText(expectedResult,{exact: true})).toBeVisible();
    }
}

}