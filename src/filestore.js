// fileReader.js
import fs from 'fs';
import path from 'path';

function readFilesInDirectory(directoryPath, fileMap) {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            readFilesInDirectory(filePath, fileMap);
        } else {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            fileMap.set(file, fileContent);
        }
    });
}


const loadFiles = (directoryPath) => {

    const fileMap = new Map();

    readFilesInDirectory(directoryPath, fileMap);

    return fileMap;

}

export { loadFiles };


