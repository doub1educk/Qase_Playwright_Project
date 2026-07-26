import { APIRequestContext,expect } from "@playwright/test";    

export class QaseApiClient{
    constructor(
        private request: APIRequestContext,
        private apiUrl: string,
        private token: string
    ){}

    private headers(){
        return {
            'Token': this.token,
            'Content-Type': 'application/json'
        }
    }

    async getAllProjects(){
        const response = await this.request.get(`${this.apiUrl}/project`, {headers: this.headers()});
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        return body.result.entities;
    }

    async deleteProject(code: string){
    const response = await this.request.delete(`${this.apiUrl}/project/${code}`, {headers: this.headers()});
    return response;
    }

    async deleteAllProjects(){
        const projects = await this.getAllProjects();
        for(const project of projects){
            await this.deleteProject(project.code);
        }
    }

    async createProject(title: string, code: string){
        const response = await this.request.post(`${this.apiUrl}/project`, {
            headers: this.headers(),
            data: {title,code}
        })
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        return body.result;
    }

    async createSuite(projectCode: string, title: string){
        const response = await this.request.post(`${this.apiUrl}/suite/${projectCode}`, {
            headers: this.headers(),
            data: {title}
        })
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        return body.result;
    }

    async getSuite(projectCode: string, suiteId: number){
        const response = await this.request.get(`${this.apiUrl}/suite/${projectCode}/${suiteId}`, 
            {headers: this.headers()});
            expect(response.ok()).toBeTruthy();
            const body = await response.json();
            return body.result;
    }

    async getSuites(projectCode: string){
        const response = await this.request.get(`${this.apiUrl}/suite/${projectCode}`, 
            {headers: this.headers()});
            expect(response.ok()).toBeTruthy();
            const body = await response.json();
            return body.result.entities;
    }

    

}