import { exec } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

// ===== CONFIG =====
const DEVICE = "/dev/video0";
const SAVE_DIR = "./images";

// Create directory if not exists
if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR, { recursive: true });
}

// Create CLI interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Type 'take' to capture an image.");
console.log("Type 'exit' to quit.");
console.log("----------------------------------");

// Function to generate unique filename
function generateFilePath() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const random = Math.floor(Math.random() * 10000);
    return path.join(SAVE_DIR, `image-${timestamp}-${random}.jpg`);
}

// Capture function
function captureImage() {
    let outputPath = generateFilePath();

    while (fs.existsSync(outputPath)) {
        outputPath = generateFilePath();
    }

    console.log("Capturing image...");
    console.log("Saving to:", outputPath);

    const command = `
    fswebcam 
    -d ${DEVICE} 
    -r 1280x720 
    --jpeg 95 
    --skip 10 
    --no-banner 
    ${outputPath}
    `;

    exec(command, (error) => {
        if (error) {
            console.error("Capture failed:", error);
            return;
        }

        console.log("Image captured successfully!");
        console.log("----------------------------------");
    });
}

// Listen for user input
rl.on("line", (input) => {

    const command = input.trim().toLowerCase();

    if (command === "take") {
        captureImage();
    }
    else if (command === "exit") {
        console.log("Exiting...");
        rl.close();
        process.exit(0);
    }
    else {
        console.log("Unknown command. Type 'take' or 'exit'.");
    }

});