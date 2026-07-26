import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve(__dirname, '.env')});
const envFile = process.env.ENV_FILE ?? 'qa.local.env';
dotenv.config({path: path.resolve(__dirname, `envs/${envFile}`)});

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps:[
    'steps/**/*.ts',
    'fixtures/fixtures.ts',
  ],
  
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL:process.env.BASE_URL,
    trace: 'on-first-retry',
    headless: true,
    viewport: { width: 1920, height: 1080 },
  },
  globalSetup: require.resolve('./setup/globalSetup.ts'),

  projects: [
    {
        name: 'login-tests',
        testDir: '.features-gen',
        testMatch: '**/login.feature.spec.js',
        use: {  
            ...devices['Desktop Chrome'],
            storageState: '.auth/privacyAcceptOnly.json'  
        }
    },
    {
        name: 'project-tests',
        testDir: '.features-gen',
        testMatch: '**/project.feature.spec.js',
        use: {  
            ...devices['Desktop Chrome'],
            storageState: '.auth/preAuthSetup.json' 
        }
    },
    {
        name: 'suite-tests',
        testDir: '.features-gen',
        testMatch: '**/suite.feature.spec.js',
        use: { ...devices['Desktop Chrome'], 
        storageState: '.auth/preAuthSetup.json' }
    },
    {
        name: 'tetsCase-tests',
        testDir: '.features-gen',
        testMatch: '**/testCase.feature.spec.js',
        use: { ...devices['Desktop Chrome'], 
        storageState: '.auth/preAuthSetup.json' }
    }
]

});
