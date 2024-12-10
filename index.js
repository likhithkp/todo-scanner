const fs = require('fs');
const path = require('path');

function scanForTodos(directoryPath) {
    let todoList = [];

    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            todoList = todoList.concat(scanForTodos(filePath)); // Recursive call for nested directories
        } else if (file.endsWith('.js')) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const regex = /TODO: (.*)/g;
            let match;
            while ((match = regex.exec(fileContent)) !== null) {
                todoList.push({
                    file: filePath,
                    line: fileContent.slice(0, match.index).split('\n').length,
                    todo: match[1],
                });
            }
        }
    });

    return todoList;
}

function printTodos(todoList) {
    if (todoList.length === 0) {
        console.log("No TODOs found.");
    } else {
        todoList.forEach(todo => {
            console.log(`File: ${todo.file} | Line: ${todo.line} | TODO: ${todo.todo}`);
        });
    }
}

const todos = scanForTodos('./src');
printTodos(todos);