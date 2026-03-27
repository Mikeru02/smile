import path from "path";
import { fileURLToPath } from "url";
import runSpawnSync from "./runSpawnSync.js";

class MessageBot {
    constructor(token, users) {
        this.token = token;
        this.users = users.split(',').map(id => parseInt(id.trim()));
    }

    async sendMessageToMaintainers(message) {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        
        // Path to Python executable in the virtual environment
        const pythonPath = path.join(__dirname, '../../', 'venv', 'bin', 'python3');
        
        // Path to the Python script
        const pythonScriptPath = path.join(__dirname, '../../', 'src', 'utils', 'tgBot.py');
        
        // Arguments for the Python script
        const args = [
            '--token', this.token,
            '--users', this.users.join(','),
            '--message', message
        ];

        try {
            // Use runSpawnSync to execute the command with Python and arguments
            const result = runSpawnSync(pythonPath, [pythonScriptPath, ...args]);

            console.log('Python script output:', result);
        } catch (err) {
            console.error('Error running Python script:', err);
        }
    }
}

export default MessageBot;