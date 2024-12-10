const fs = require('fs');
const path = require('path');

function scanForTodos(directoryPath) {
    let todoList = [];

    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
        console.error(`Error: Directory "${directoryPath}" does not exist.`);
        return todoList; // Return empty list
    }

    if (!fs.statSync(directoryPath).isDirectory()) {
        console.error(`Error: "${directoryPath}" is not a directory.`);
        return todoList; // Return empty list
    }

    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        try {
            if (fs.statSync(filePath).isDirectory()) {
                // Recursive call for nested directories
                todoList = todoList.concat(scanForTodos(filePath));
            } else if (file.endsWith('.js')) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const regex = /TODO: (.*)/g;
                let match;
                while ((match = regex.exec(fileContent)) !== null) {
                    todoList.push({
                        file: filePath,
                        line: fileContent.slice(0, match.index).split('\n').length,
                        todo: match[1].trim(),
                    });
                }
            }
        } catch (err) {
            console.error(`Error reading file or directory: ${filePath}. Skipping.`);
        }
    });

    return todoList;
}

function printTodos(todoList) {
    if (todoList.length === 0) {
        console.log("No TODOs found.");
    } else {
        console.log("TODOs found:");
        todoList.forEach(todo => {
            console.log(`File: ${todo.file} | Line: ${todo.line} | TODO: ${todo.todo}`);
        });
    }
}

// Set the directory to scan
const directoryToScan = './src';

// Scan and print TODOs
try {
    const todos = scanForTodos(directoryToScan);
    printTodos(todos);
} catch (err) {
    console.error(`Unexpected error: ${err.message}`);
}
