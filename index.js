const fs = require('fs');
const path = require('path');

// Function to scan the directory recursively for 'TODO' comments
function scanForTodos(directoryPath) {
    let todoList = [];

    try {
        // Check if the directory exists before scanning
        if (!fs.existsSync(directoryPath)) {
            console.error("Directory not found:", directoryPath);
            return todoList;
        }

        const files = fs.readdirSync(directoryPath);

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            // If the file is a directory, recursively scan it
            if (fs.statSync(filePath).isDirectory()) {
                todoList = todoList.concat(scanForTodos(filePath));
            } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts')) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const regex = /TODO:\s*(.*)/g;  // Match 'TODO: some task' (with optional spaces after TODO:)
                let match;

                while ((match = regex.exec(fileContent)) !== null) {
                    // Count the line number where the TODO is found
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
const directoryPath = process.argv[2] || './src';  // Allow passing directory as an argument
console.log('Scanning directory:', directoryPath);  // Debug the passed path

const todos = scanForTodos(directoryPath);
printTodos(todos);
