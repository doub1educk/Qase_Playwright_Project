import * as fs from 'fs/promises';
import * as path from 'path';

export async function createTestFile(
    length: number = 20,
    fileName?: string
): Promise<string> {
    const dir = path.join(process.cwd(),'test-file');
    await fs.mkdir(dir, { recursive: true });

    const finalName = fileName || `file-${Date.now()}.txt`;
    const filePath = path.join(dir, finalName);

    const randomString = Math.random().toString(36).substring(2, 2 + length);

    await fs.writeFile(filePath, randomString, 'utf-8');
    return filePath;
}

export async function deleteTestFile(filePath: string){
    try{
        await fs.unlink(filePath);
    } catch(error){
        console.log("Error delete test file :", error);
    }
}