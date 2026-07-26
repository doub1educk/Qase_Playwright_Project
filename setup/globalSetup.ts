import {execSync} from 'child_process';

export default async function globalSetup() {
  try {
    execSync('npx tsx setup/privacyAcceptOnly.setup.ts', { stdio: 'inherit' });
    execSync('npx tsx setup/preAuthSetup.setup.ts', { stdio: 'inherit' });
  } catch (error: any) {
    console.error('critical error in global setup:');
    if (error.stdout) console.error(error.stdout.toString());
    if (error.stderr) console.error(error.stderr.toString());
    
    process.exit(1);
  }
}