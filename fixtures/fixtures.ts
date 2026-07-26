import {test as base} from 'playwright-bdd';
import {QaseApiClient} from '../api/qaseApiClient';
import {TestContext} from '../fixtures/testContext';
import{deleteTestFile} from '../utils/randomFile';
import dotnev from 'dotenv';
import path from 'path';

dotnev.config({path: path.resolve(__dirname, '.env')});
const envFile = process.env.ENV_FILE ?? 'qa.local.env';
dotnev.config({path: path.resolve(__dirname, `envs/${envFile}`)});

type Fixtures = {
    apiClient: QaseApiClient,
    testContext: TestContext
};

export const test = base.extend<Fixtures>({
    apiClient: async({request}, use) => {
        const client = new QaseApiClient(request, process.env.API_URL!, process.env.API_TOKEN!);
        await client.deleteAllProjects();
        await use(client);
    },

    testContext: async({apiClient}, use) => {
        const context = new TestContext();

        await use(context);

        if(context.has('projectCode')){
            const code = context.get<string>('projectCode');
            await apiClient.deleteProject(code);
        }
        if (context.has('createdFilePaths')) {
        const filePaths = context.get<string[]>('createdFilePaths');
        for (const filePath of filePaths) {
            await deleteTestFile(filePath);
            }
        }
    }
});