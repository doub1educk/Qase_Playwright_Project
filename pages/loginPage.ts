import {Locator,expect,Page} from '@playwright/test';

export class LoginPage{
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginErrorAlert: Locator;
    readonly privacyPolicyAcceptButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.emailInput = page.getByPlaceholder('email');
        this.passwordInput = page.getByPlaceholder('password');
        this.loginButton = page.getByRole('button', { name: 'Sign in' });
        this.loginErrorAlert = page.getByRole('alert');
        this.privacyPolicyAcceptButton = page.locator('#accept');
    }

    async openLoginPage(){
        await this.page.goto('/login');
    }

    async fillEmailInput(email: string){
        await this.emailInput.fill(email);
    }

    async fillPasswordInput(password: string){
        await this.passwordInput.fill(password);
    }

    async clickLoginButton(){
        await this.loginButton.click();
    }

    async checkLoginErrorAlert(text: string){
        await expect(this.loginErrorAlert).toHaveText(text);
    }

    async checkLoginPageUrl(){
        await expect(this.page).toHaveURL('/login');
    }

    waitForProjectListLoad(){
        return this.page.waitForResponse(
            res => res.url().includes('/v1/projects/list') && res.request().method() === 'POST'
        );
    }

    async checkProjectsPageUrl(){
        await expect(this.page).toHaveURL(/.*\/projects/);
    }

    

}
