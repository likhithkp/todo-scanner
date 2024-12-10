# todo-scanner

**todo-scanner** is a lightweight Node.js utility that scans your codebase for `TODO` comments and lists them with their file locations and line numbers.

## Features
- Scans all `.js` files in a specified directory.
- Identifies and lists `TODO:` comments.
- Provides the file name and line number for each TODO.
- Supports nested directories.

## Installation
Install the package via npm:
```bash
npm install todo-scanner
```

## Usage
## Command-Line Interface
- Navigate to the directory you want to scan.
- Run the following command:

```bash
npx todo-scanner ./src
```

## The output will be:

```bash
File: example.js | Line: 1 | TODO: Refactor this function
```
