# ⚠️ Bluebird Warning & Error Handling Patterns

## Table of Contents

- [⚠️ Bluebird Warning \& Error Handling Patterns](#️-bluebird-warning--error-handling-patterns)
  - [Table of Contents](#table-of-contents)
  - [🧾 Introduction](#-introduction)
  - [⚠️ Warnings](#️-warnings)
    - [`.then()` Only Accepts Functions](#then-only-accepts-functions)
    - [Warning: a promise was rejected with a non-error](#warning-a-promise-was-rejected-with-a-non-error)
    - [Runaway Promises (Not Returned)](#runaway-promises-not-returned)
  - [❌ Common Errors](#-common-errors)
    - [Error Object Expectations](#error-object-expectations)
    - [`Promise.promisify` on an Object](#promisepromisify-on-an-object)
    - [`Promise` Constructor Requires a Resolver](#promise-constructor-requires-a-resolver)
    - [Cannot Invoke Promise Constructor Directly](#cannot-invoke-promise-constructor-directly)
    - [`generatorFunction must be a function`](#generatorfunction-must-be-a-function)
    - [`promisifyAll` Target Must Be Object or Function](#promisifyall-target-must-be-object-or-function)
    - [Cannot Promisify API That Has Async Suffix Methods](#cannot-promisify-api-that-has-async-suffix-methods)
  - [✅ Best Practices](#-best-practices)
  - [✅ Conclusion](#-conclusion)

---

## 🧾 Introduction

Bluebird is a powerful promise library that enhances error handling and debugging. However, misuse of promises can lead to **unexpected behavior**, **silent failures**, or **cryptic warnings**.

This document captures **frequent pitfalls**, **warnings**, and **how to fix them**.

---

## ⚠️ Warnings

### `.then()` Only Accepts Functions

**Bad:**

```js
getImage().then(processImage());
```

Here, `processImage()` is executed **immediately**, and its **return value** is passed to `.then()`, likely `undefined`. The above calls the function processImage() immediately and passes the result to .then() (which is most likely undefined - the default return value when a function doesn't return anything).

**Fix:**

```js
getImage().then(processImage); // pass the function reference
```

---

### Warning: a promise was rejected with a non-error

Due to a historic mistake in JavaScript, the throw statement is allowed to be used with any value, not just errors, and Promises/A+ choosing to inherit this mistake, it is possible to reject a promise with a value that is not an error.

An error is an object that is a instanceof Error. It will at minimum have the properties .stack and .message, which are an absolute must have for any value that is being used in an automatic propagation mechanism, such as exceptions and rejections. This is because errors are usually handled many levels above where they actually originate - the error object must have sufficient metadata about it so that its ultimate handler (possibly many levels above) will have all the information needed for creating a useful high level error report.

Since all objects support having properties you might still wonder why exactly does it have to be an error object and not just any object. In addition to supporting properties, an equally important feature necessary for values that are automatically propagated is the stack trace property (.stack). A stack trace allows you easily find where an error originated from as it gives the code's call stack - along with line numbers for reference in code files.

You should heed this warning because rejecting a promise with a non-error makes debugging extremely hard and costly. Additionally, if you reject with simple primitives such as undefined (commonly caused by simply calling reject()) you cannot handle errors at all because it's impossible to tell from undefined what exactly went wrong. All you can tell the user is that "something went wrong" and lose them forever.

---

### Runaway Promises (Not Returned)

**Bad:**

```js
getUser()
  .then(function (user) {
    getUserData(user); // ← forgot return
  })
  .then(function (data) {
    console.log(data); // undefined
  });
```

**Fix:**

```js
getUser()
  .then(function (user) {
    return getUserData(user); // ← return fixed it
  })
  .then(function (data) {
    console.log(data);
  });
```

**Optional Background Task:**

```js
getUser().then(function (user) {
  saveAnalytics(user);
  return null; // suppress warning intentionally
});
```

---

## ❌ Common Errors

### Error Object Expectations

- Always reject with an instance of `Error`, not `undefined` or a string.

**Bad:**

```js
reject("Something broke"); // Not ideal
reject(); // Worst
```

**Good:**

```js
reject(new Error("Something broke"));
```

**Why?**

- `.stack` and `.message` give meaningful debug info.
- Easier to track origin of failure.

---

### `Promise.promisify` on an Object

You got this this error because you've used Promise.promisify on an object, for example:

**Bad:**

```js
const fs = Promise.promisify(require("fs"));
```

**Fix:**

```js
const fs = Promise.promisifyAll(require("fs"));
```

---

### `Promise` Constructor Requires a Resolver

**Bad:**

```js
const p = new Promise(); // Error!
```

**Fix:**

```js
const p = new Promise(function (resolve, reject) {
  // async operation
});
```

---

### Cannot Invoke Promise Constructor Directly

**Bad:**

You forgot to use new when creating a new promise using new Promise(resolver) syntax.

```js
return Promise(function (resolve, reject) {
  // ...
});
```

**Fix:**

```js
return new Promise(function (resolve, reject) {
  // ...
});
```

---

### `generatorFunction must be a function`

**Cause:**

- Passed a regular function instead of a generator function to `Promise.coroutine`.

**Fix:**

```js
const run = Promise.coroutine(function* () {
  const result = yield someAsyncTask();
  return result;
});
```

---

### `promisifyAll` Target Must Be Object or Function

**Bad:**

```js
const lib = Promise.promisifyAll(require("someModule")());
```

**Fix:**

```js
const lib = Promise.promisifyAll(require("someModule"));
```

---

### Cannot Promisify API That Has Async Suffix Methods

**Bad:**

```js
const myApi = {
  foo: function (cb) {},
  fooAsync: function (cb) {},
};
Promise.promisifyAll(myApi); // ❌ Conflict
```

**Fix Option 1:**

- Rename `fooAsync` manually.

**Fix Option 2:**

- Use a different suffix:

```js
Promise.promisifyAll(myApi, { suffix: "Promise" });
```

---

## ✅ Best Practices

| ❌ Don’t                                  | ✅ Do                                       |
| ----------------------------------------- | ------------------------------------------- |
| Call functions inside `.then()`           | Pass function reference to `.then()`        |
| Forget `return` in promise chains         | Always return promises inside `.then()`     |
| Reject with non-Error values              | Use `new Error()` for rejections            |
| Promisify objects with `fooAsync`         | Rename or use custom suffix                 |
| Use `Promise()` without `new` or resolver | Use `new Promise((resolve, reject) => { })` |

---

## ✅ Conclusion

These warnings and errors are **designed to help you write better async code** using Bluebird. By understanding how promises work internally and avoiding common pitfalls, your code becomes:

- More predictable
- Easier to debug
- Better structured

---
