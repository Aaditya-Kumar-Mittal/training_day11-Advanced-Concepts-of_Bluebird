# Parallel File Creation using Bluebird and Promise.all()

## Table of Contents

- [Parallel File Creation using Bluebird and Promise.all()](#parallel-file-creation-using-bluebird-and-promiseall)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Problem Description](#problem-description)
    - [Examples](#examples)
      - [Example Output](#example-output)
      - [If a failure occurs](#if-a-failure-occurs)
    - [Constraints](#constraints)
  - [Approach](#approach)
  - [Detailed Explanation of Code](#detailed-explanation-of-code)
    - [Node.js (v5) + Bluebird Implementation](#nodejs-v5--bluebird-implementation)
      - [Explanation](#explanation)
  - [How to Run the Code](#how-to-run-the-code)
    - [Installation](#installation)
    - [Run Instructions](#run-instructions)
    - [Output](#output)
    - [Files Created](#files-created)

---

## Introduction

In asynchronous programming, it's often necessary to run multiple operations in parallel and wait for all of them to finish. In Node.js, this is achieved with promises. The `Promise.all()` method allows you to run many async tasks concurrently and wait until they are all completed.

This documentation demonstrates how to use `Promise.all()` in combination with the **Bluebird** library to create **100 empty text files** asynchronously using Node.js v5.

---

## Problem Description

We want to create 100 text files in parallel using Node.js. The native `fs.writeFile` function uses callbacks, which we need to convert to promises using Bluebird's `promisify` method. Once we have a promise-based function, we will use `Promise.all()` to wait until all file creation operations complete.

### Examples

#### Example Output

```bash
✅ All the files were created successfully.
```

#### If a failure occurs

```bash
❌ Error occurred while creating files: EACCES: permission denied, open 'file-2.txt'
```

---

### Constraints

- Node.js version: **v5**
- Library: **Bluebird v3.4.7**
- File encoding: `"utf-8"`
- Directory must have write permissions
- Max number of files: 100 (can be scaled)

---

## Approach

1. Import `fs` and `bluebird`.
2. Promisify `fs.writeFile` using `Promise.promisify()`.
3. Create an array of 100 promises where each one writes an empty string to `file-i.txt`.
4. Use `Promise.all()` to execute all promises in parallel.
5. Handle success and error using `.then()` and `.catch()`.

---

## Detailed Explanation of Code

### Node.js (v5) + Bluebird Implementation

```js
// Load core and third-party modules
var fs = require("fs");
var Promise = require("bluebird");

// Convert fs.writeFile into a promise-based function
fs.writeFileAsync = Promise.promisify(fs.writeFile);

// Step 1: Prepare array of promises
var files = [];
for (var i = 0; i < 100; ++i) {
  files.push(fs.writeFileAsync("file-" + i + ".txt", "", "utf-8"));
}

// Step 2: Run all file creations in parallel
Promise.all(files)
  .then(function () {
    console.log("✅ All the files were created successfully.");
  })
  .catch(function (err) {
    console.error("❌ Error occurred while creating files:", err.message);
  });
```

#### Explanation

- `Promise.promisify(fs.writeFile)` converts the Node.js callback-style function into one that returns a promise.
- The `for` loop prepares 100 promises, each creating one file.
- `Promise.all(files)` runs them all in parallel and resolves only when all succeed.
- `.catch()` ensures that even a single failure is caught and logged.

---

## How to Run the Code

### Installation

> 💡 Ensure you are using **Node.js v5** and `npm` is available.

```bash
npm install bluebird@3.4.7 --save
```

### Run Instructions

1. Create a file called `createFiles.js` and paste the code above into it.
2. Run the file using:

```bash
node createFiles.js
```

### Output

```bash
✅ All the files were created successfully.
```

### Files Created

You will see:
plaintext

```plaintext
file-0.txt
file-1.txt
...
file-99.txt
```

All files are empty and encoded in UTF-8.

---
