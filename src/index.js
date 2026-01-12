import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(import.meta.url);
const directory = path.dirname(file);

const app = express();
const port = process.env.PORT || 80;
const host = process.env.HOST || '0.0.0.0';

const distDirectory = path.join(directory, "dist");

app.use(express.static(distDirectory));

app.get(['/generate_204', '/hotspot-detect.html'], (req, res) => {
    res.redirect(302, '/');
});

app.get('*', (req, res) => {
    const filePath = path.join(distDirectory, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(distDirectory, 'index.html'))
    }
})

app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});