import {Locator,expect,Page} from '@playwright/test';

export class ProjectsPage{
    readonly page: Page
    readonly createProjectButton: Locator
    readonly projectNameInput: Locator
    readonly projectCodeInput: Locator
    readonly submitCreatingProjectButton: Locator
    readonly projectsButtonInHeader: Locator;
    readonly createNewSuiteButton: Locator
    readonly suiteNameInput: Locator   
    readonly createSuiteButton: Locator 
    constructor(page:Page){
        this.page = page;
        this.createProjectButton = page.getByRole('button', { name: 'Create new project' });
        this.projectNameInput = page.locator('#project-name');
        this.projectCodeInput = page.locator('#project-name');
        this.submitCreatingProjectButton = page.getByRole('button', { name: 'Create project' });
        this.projectsButtonInHeader = page.getByRole('link', { name: 'Projects' });
        this.createNewSuiteButton = page.getByRole('button', { name: 'Create new suite' });
        this.suiteNameInput = page.locator('#title');
        this.createSuiteButton = page.getByRole('button', { name: 'Create', exact: true });
    }

    async clickCreateNewProjectButton(){
        await this.createProjectButton.click();
    }

    async fillProjectNameInput(name: string){
        await this.projectNameInput.fill(name);
    }

    async fillProjectCodeInput(code: string){
        await this.projectCodeInput.fill(code);
    }

    async fillSuiteNameInput(name: string){
        await this.suiteNameInput.fill(name);
    }

    async clickSubmitCreatingProjectButton(){
        await this.submitCreatingProjectButton.click();
    }

    async clickCreateSuiteButton(){
        await this.createSuiteButton.click();
    }

    async clickProjectsButtonInHeader(){

        await this.projectsButtonInHeader.click();
    }

    async clickCreateNewSuiteButton(){
        await this.createNewSuiteButton.click();
    }

    waitForProjectListLoad(){
        return this.page.waitForResponse(
            res => res.url().includes('/v1/projects/list') && res.request().method() === 'POST'
        );
    }

    waitForSuitesListLoad(projectCode: string){
        return this.page.waitForResponse(
            response => response.url().includes('v1/get-suites-tree') && response.request().method() === 'POST'
        );
    }

    async gotoSpecificProject(projectCode: string){
        await this.page.goto('/project/' + projectCode);
    }

    async gotoProjectPage(){
        await this.page.goto('/projects');
    }

    async clickOnSpecificSuite(title: string){
        await this.page.locator('span[id^="suite-tree-"]').getByText(title).click();
    }

    async clickOnTestSuiteDropdownMenu(testCaseTitle: string){
       await this.page.getByLabel(`suite ${testCaseTitle} actions`).click(); 
    }

    async clickOnButtonToCreateNewTestCase(){
        await this.page.locator('[data-key="create_case"]').click();
    }

    
}