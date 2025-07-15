# 🔄 Mastering `Promise.map()` with Bluebird

## 📘 What is `Promise.map()`?

`Promise.map()` is a Bluebird method that lets you:

- 📦 **Take a list (array)**
- 🚀 **Run async operations** (like reading files, making API calls)
- ⚡ **Control how many run at once** (concurrency)
- ✅ **Wait for all to complete**
- 📬 Get back a **new array** with the results

---

## 🤔 Why use `Promise.map()`?

- To **avoid manual `.push + Promise.all()`** code
- To **process arrays of items** with async logic
- To **limit concurrency** (e.g., only 3 tasks running at a time)
- To keep **mapped results in order** (output = input order)

---

## 🧠 What does `Promise.map()` return?

A **single Promise** that:

- ✅ Resolves to an array of results (same order as input)
- ❌ Rejects immediately if any mapper call fails

---

## 🧪 When to Use It?

| Use Case                               | Use `Promise.map()`?             |
| -------------------------------------- | -------------------------------- |
| Async loop over an array               | ✅ Yes                           |
| Want result in same input order        | ✅ Yes                           |
| Need concurrency limit                 | ✅ Yes                           |
| Inputs are unrelated / no need for key | ✅ Yes                           |
| Input is object with named keys        | ❌ Use `Promise.props()` instead |
| Just want to run everything at once    | ✅ Use `Promise.all()`           |

---

## 🧬 How it compares to others

| Feature         | `Promise.map()` | `Promise.all()` | `Promise.props()` |
| --------------- | --------------- | --------------- | ----------------- |
| Input Type      | Array           | Array           | Object            |
| Output Type     | Array           | Array           | Object            |
| Maintains Order | ✅ Yes          | ✅ Yes          | ✅ Yes            |
| Concurrency     | ✅ Configurable | ❌ All at once  | ❌ All at once    |

---

## 🧪 Exercises (Node.js v5 Compatible)

> 💡 Make sure you run:

```bash
npm install bluebird@3.4.7 --save
```

---

### 📁 Exercise 1: Read Multiple Files in Parallel (No Concurrency Limit)

**File:** `readFilesParallel.js`

```js
var fs = require("fs");
var Promise = require("bluebird");

fs.readFileAsync = Promise.promisify(fs.readFile);

var fileNames = ["file1.txt", "file2.txt", "file3.txt"];

Promise.map(fileNames, function (fileName) {
  return fs.readFileAsync(fileName, "utf8");
})
  .then(function (contents) {
    contents.forEach((text, i) => {
      console.log(`📄 ${fileNames[i]} → ${text.length} chars`);
    });
  })
  .catch(function (err) {
    console.error("❌ Failed to read:", err.message);
  });
```

✅ Reads all files in **parallel**

---

### 🕗 Exercise 2: Add Delay to See Concurrency

**File:** `delayedMap.js`

```js
var Promise = require("bluebird");

function delayedTask(item) {
  return new Promise(function (resolve) {
    var delay = 1000; // 1 second
    console.log(`⏳ Starting ${item}`);
    setTimeout(() => {
      console.log(`✅ Done ${item}`);
      resolve(item * 2);
    }, delay);
  });
}

Promise.map([1, 2, 3, 4, 5], delayedTask).then(function (result) {
  console.log("🎉 Results:", result); // [2, 4, 6, 8, 10]
});
```

> Output shows all tasks running **together**

---

### ⚖️ Exercise 3: Add `concurrency: 2`

**File:** `concurrencyLimit.js`

```js
var Promise = require("bluebird");

function fakeApi(index) {
  return new Promise(function (resolve) {
    console.log("📤 Calling API", index);
    setTimeout(() => {
      console.log("📥 Got result from API", index);
      resolve("Result-" + index);
    }, 1000);
  });
}

Promise.map([1, 2, 3, 4, 5], fakeApi, { concurrency: 2 }).then(function (
  results
) {
  console.log("✅ Final Results:", results);
});
```

> Only **2 tasks run at once**
> Output will show pairs of calls

---

### 🧱 Exercise 4: File Details using `fs.statAsync`

**File:** `fileStats.js`

```js
var fs = require("fs");
var path = require("path");
var Promise = require("bluebird");

fs.readdirAsync = Promise.promisify(fs.readdir);
fs.statAsync = Promise.promisify(fs.stat);

fs.readdirAsync(".")
  .then(function (files) {
    return Promise.map(
      files,
      function (file) {
        return fs.statAsync(file).then(function (stat) {
          return {
            file: file,
            size: stat.size,
            modified: stat.mtime,
          };
        });
      },
      { concurrency: 3 }
    );
  })
  .then(function (info) {
    info.forEach(function (f) {
      console.log(`📄 ${f.file}: ${f.size} bytes, modified ${f.modified}`);
    });
  })
  .catch(function (err) {
    console.error("❌ Error:", err.message);
  });
```

---

## 🧠 Key Concepts Recap

| Feature        | Details                                           |
| -------------- | ------------------------------------------------- |
| ✅ Input       | Array (or Promise of array)                       |
| 🔁 Mapper      | Function that returns a Promise                   |
| ⚡ Concurrency | How many Promises run at once (default: Infinity) |
| 🧾 Output      | Promise that resolves to array of results         |
| ❌ Failure     | If any item fails, the entire `.map()` rejects    |

---

## 🧠 Tips

- **Always return a Promise** from the mapper
- Use `.catch()` at the end to catch any errors
- For **sequential execution**, use `Promise.mapSeries()` instead

---

### ✅ What does **"avoid manual `.push + Promise.all()`"** mean?

When you're working with **arrays of data** and want to perform async operations (like reading files, calling APIs), a common beginner pattern looks like this:

---

## ❌ Manual `.push + Promise.all()` Approach

```js
var fs = require("fs");
var Promise = require("bluebird");
fs.readFileAsync = Promise.promisify(fs.readFile);

var fileNames = ["file1.txt", "file2.txt", "file3.txt"];
var promises = [];

for (var i = 0; i < fileNames.length; i++) {
  // 👇 manually pushing each promise
  promises.push(fs.readFileAsync(fileNames[i], "utf8"));
}

Promise.all(promises).then(function (contents) {
  console.log("✅ All files read");
  console.log(contents);
});
```

### 🔍 What’s happening here?

- You're **looping over the input array**
- Creating a **new promise** for each item
- **Manually adding** each promise to a new array (`promises`)
- Using `Promise.all()` to wait for all

This works — but it's **boilerplate code** and harder to read and maintain.

---

## ✅ The Clean `Promise.map()` Version

```js
var fs = require("fs");
var Promise = require("bluebird");
fs.readFileAsync = Promise.promisify(fs.readFile);

var fileNames = ["file1.txt", "file2.txt", "file3.txt"];

Promise.map(fileNames, function (fileName) {
  return fs.readFileAsync(fileName, "utf8");
}).then(function (contents) {
  console.log("✅ All files read");
  console.log(contents);
});
```

### 🧠 Why is this better?

- No need to create and manage a separate `promises` array
- **Cleaner, declarative style**
- Automatically preserves order of input → output
- Supports **concurrency limits** (like `Promise.map(arr, fn, { concurrency: 3 })`)

---

## ✅ TL;DR

| Pattern                 | Drawback                               |
| ----------------------- | -------------------------------------- |
| `.push + Promise.all()` | Verbose, manual, not concurrency-aware |
| `Promise.map()`         | Cleaner, built-in concurrency support  |

So, when we say:

> “To avoid manual `.push + Promise.all()`…”

We mean: **Don’t write your own loop** to collect promises — just use `Promise.map()` and let Bluebird do the heavy lifting for you. 🚀

You're absolutely right — and this is an important behavior to understand when working with **Bluebird's `.map()`**.

---

## 🧠 Why `.map()` Doesn’t Stop on First Failure

By design, **`Bluebird.map()` runs all promises in parallel (or with concurrency control)**.
It collects results for all items — even if **some promises reject**.

So:

- It does **not stop immediately** when one fails (unlike `Promise.all()`).
- Instead, it waits for **all mapped promises** to settle.
- If **any promise fails**, the entire `.map()` fails after all finish.

---

## 🔍 Example: `.map()` with a Failing Promise

```js
var Promise = require("bluebird");

var items = [1, 2, 3, 4];

Promise.map(items, function (num) {
  if (num === 3) {
    return Promise.reject(new Error("Failed at 3"));
  }
  console.log("Processing", num);
  return Promise.resolve(num * 2);
})
  .then(function (results) {
    console.log("Results:", results);
  })
  .catch(function (err) {
    console.error("❌ Error:", err.message);
  });
```

### 🔎 Output

```bash
Processing 1
Processing 2
Processing 4
❌ Error: Failed at 3
```

➡️ Even though item 3 failed, item 4 still ran.

---

## 🛠 How to Stop Execution on First Failure?

If you want to stop as soon as **one fails**, you should **use a `for` loop + early return**, or `Promise.each()` with `throw`:

### ✅ Using `Promise.each()` (serial execution)

```js
var Promise = require("bluebird");

var items = [1, 2, 3, 4];

Promise.each(items, function (num) {
  if (num === 3) {
    throw new Error("Stop at 3");
  }
  console.log("Processing", num);
  return Promise.resolve();
})
  .then(function () {
    console.log("✅ Done");
  })
  .catch(function (err) {
    console.error("❌ Caught:", err.message);
  });
```

### 🔎 Output - 2

```bash
Processing 1
Processing 2
❌ Caught: Stop at 3
```

---

## ✅ Summary

| Method           | Runs in Parallel | Stops on First Failure? |
| ---------------- | ---------------- | ----------------------- |
| `Promise.all()`  | ✅               | ✅                      |
| `Promise.map()`  | ✅               | ❌ (waits for all)      |
| `Promise.each()` | ❌ (serial)      | ✅                      |

| You Want To...                           | Use `Promise.map()`?     |
| ---------------------------------------- | ------------------------ |
| Transform array of values asynchronously | ✅                       |
| Keep output order same as input          | ✅                       |
| Limit number of async tasks at a time    | ✅                       |
| Work with objects / named keys           | ❌ Use `Promise.props()` |
| Just wait for all without mapping        | ❌ Use `Promise.all()`   |
