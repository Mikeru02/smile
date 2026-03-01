import fsExtra from 'fs/promises';

async function waitForFile(filePath, timeout = 2000) {
    const start = Date.now();
    while (true) {
        try {
            await fsExtra.access(filePath);
            return true;
        } catch {
            if (Date.now() - start > timeout) throw new Error(`File not found: ${filePath}`);
            await new Promise(res => setTimeout(res, 50)); // wait 50ms
        }
    }
}

export default waitForFile;