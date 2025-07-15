# Mastering `Promise.props()` with Bluebird

## Table of Contents

- [Mastering `Promise.props()` with Bluebird](#mastering-promiseprops-with-bluebird)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Problem Description](#problem-description)
    - [Examples](#examples)
    - [Constraints](#constraints)
  - [Approach](#approach)
  - [Detailed Explanation of Code](#detailed-explanation-of-code)
    - [Exercise 1: All Properties Resolve](#exercise-1-all-properties-resolve)
    - [Exercise 2: One Property Rejects](#exercise-2-one-property-rejects)
    - [Exercise 3: Real Filesystem Inspection](#exercise-3-real-filesystem-inspection)
    - [Bonus: Random Failures](#bonus-random-failures)
  - [Complexity Analysis](#complexity-analysis)
  - [How to Run the Code](#how-to-run-the-code)
    - [Installation](#installation)
    - [Run Instructions](#run-instructions)
  - [Key Differences Between `Promise.all()` and `Promise.props()`](#key-differences-between-promiseall-and-promiseprops)
  - [Summary](#summary)

---

## Introduction

`Promise.props()` is a Bluebird-specific utility that allows you to work with **objects of promises** rather than arrays. It is extremely useful when you want to maintain **keyed structure** while waiting for multiple asynchronous operations.

> 🛠 Unlike `Promise.all()`, which works on arrays, `Promise.props()` works on objects.

---

## Problem Description

You often need to call multiple APIs or perform asynchronous tasks in parallel and want to collect their results with meaningful keys. Bluebird's `Promise.props()` enables this by preserving object structure while resolving all promises.

> We will use it when we want to wait for multiple asynchronous operations to complete. But, then we want to collect data for a particular key.

### Examples

```js
Promise.props({
  user: getUser(),
  posts: getPosts(),
  comments: getComments()
})
.then(result => {
  console.log(result.user);
  console.log(result.posts);
  console.log(result.comments);
});
```

### Constraints

- Bluebird must be used (Node.js v5+ compatible)
- All values in the object should be promises or values
- If any promise rejects, the entire result is rejected

---

## Approach

- Promisify Node-style callback functions (e.g., `fs.readFile`)
- Create an object with promises as values
- Pass the object to `Promise.props()`
- Use `.then()` for successful resolution and `.catch()` for failure

---

## Detailed Explanation of Code

### Exercise 1: All Properties Resolve

```js
var Promise = require("bluebird");

function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

Promise.props({
  user: delay(300, { id: 1, name: "Alice" }),
  settings: delay(500, { theme: "dark" }),
  logs: delay(200, ["login", "logout"])
}).then(data => {
  console.log("✅ All resolved:", data);
});
```

> Returns:

```json
{
  "user": { "id": 1, "name": "Alice" },
  "settings": { "theme": "dark" },
  "logs": ["login", "logout"]
}
```

---

### Exercise 2: One Property Rejects

```js
Promise.props({
  a: Promise.resolve("ok"),
  b: Promise.reject(new Error("fail")),
  c: Promise.resolve("still ok")
}).then(data => {
  console.log(data);
}).catch(err => {
  console.error("❌ Failed:", err.message);
});
```

> Output:

```bash
❌ Failed: fail
```

---

### Exercise 3: Real Filesystem Inspection

```js
const fs = require("fs");
const path = require("path");
const Promise = require("bluebird");
fs.readdirAsync = Promise.promisify(fs.readdir);
fs.statAsync = Promise.promisify(fs.stat);

function fileStats(dir) {
  return fs.readdirAsync(dir).then(files => {
    return Promise.props({
      totalFiles: files.length,
      firstFile: files[0],
      firstStat: fs.statAsync(path.join(dir, files[0]))
    });
  });
}

fileStats(".").then(data => {
  console.log("📁 Directory Info:", data);
});
```

---

### Bonus: Random Failures

```js
function maybeFail(label) {
  return new Promise((resolve, reject) => {
    const fail = Math.random() < 0.3;
    setTimeout(() => {
      if (fail) reject(new Error(`${label} failed`));
      else resolve(`${label} success`);
    }, 500);
  });
}

Promise.props({
  api1: maybeFail("API-1"),
  api2: maybeFail("API-2"),
  api3: maybeFail("API-3")
}).then(console.log).catch(err => console.error("❌", err.message));
```

---

## Complexity Analysis

| Operation        | Time Complexity |
| ---------------- | --------------- |
| All Promises Run | O(n) (parallel) |
| Memory Usage     | O(n)            |

> All keys are processed in parallel, similar to `Promise.all()` but mapped to object keys.

---

## How to Run the Code

### Installation

```bash
npm install bluebird@3.4.7 --save
```

### Run Instructions

```bash
node exercise1-all-resolve.js
node exercise2-one-reject.js
node exercise3-real-fs-inspection.js
```

---

## Key Differences Between `Promise.all()` and `Promise.props()`

| Feature                | `Promise.all()`            | `Promise.props()`       |
| ---------------------- | -------------------------- | ----------------------- |
| Input Type             | Array of Promises          | Object with Promises    |
| Output Type            | Array of results (ordered) | Object with same keys   |
| Key Mapping            | Lost                       | Preserved               |
| Use Case               | Homogeneous tasks          | Named, structured tasks |
| Available in Bluebird? | ✅ Yes (native also)        | ✅ Yes (Bluebird only)   |

---

## Summary

✅ **Use `Promise.props()` when**:

- You want **keyed results**
- You’re executing **parallel tasks** with semantic meaning
- You prefer **clean code** without converting objects into arrays

🧠 Remember:

- Fails fast like `Promise.all()`
- Only available in Bluebird
- Returns an object with resolved values at respective keys

---
