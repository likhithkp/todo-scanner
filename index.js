const fs = require('fs');
const path = require('path');

// Function to scan the directory recursively for 'TODO' comments
function scanForTodos(directoryPath) {
    let todoList = [];

    try {
        const files = fs.readdirSync(directoryPath);

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            // If the file is a directory, recursively scan it
            if (fs.statSync(filePath).isDirectory()) {
                todoList = todoList.concat(scanForTodos(filePath));
            } else if (file.endsWith('.js')) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const regex = /TODO:\s*(.*)/g;  // Match 'TODO: some task' (with optional spaces after TODO:)
                let match;
                while ((match = regex.exec(fileContent)) !== null) {
                    // Count the line number
                    const lineNumber = fileContent.slice(0, match.index).split('\n').length;
                    todoList.push({
                        file: filePath,
                        line: lineNumber,
                        todo: match[1]
                    });
                }
            }
        });
    } catch (error) {
        console.error("Error reading the directory or file:", error);
    }

    return todoList;
}

// Function to print the found 'TODO' items
function printTodos(todoList) {
    if (todoList.length === 0) {
        console.log("No TODOs found.");
    } else {
        todoList.forEach(todo => {
            console.log(`File: ${todo.file} | Line: ${todo.line} | TODO: ${todo.todo}`);
        });
    }
}

// Ensure the directory exists and call the function
const directoryPath = './src';
if (fs.existsSync(directoryPath)) {
    const todos = scanForTodos(directoryPath);
    printTodos(todos);
} else {
    console.error("The specified directory does not exist.");
}
