# ✅ Node.js v5 Compatible Installation Guide

> ⚠️ Use `npm install <package>@<version>` to install specific versions compatible with Node.js v5.

---

## 🔹 1. Bluebird (Promisification Library)

```bash
npm install bluebird@3.4.7
```

- ✅ Fully compatible with Node.js v5
- 🔧 Use `.promisify()` to convert callbacks to promises

---

## 🔹 2. Express (Web framework)

```bash
npm install express@4.14.0
```

- ✅ Compatible with Node.js v5
- 🧱 Use for building REST APIs or web apps

---

## 🔹 3. Body-parser (Parse JSON or form data in requests)

```bash
npm install body-parser@1.15.2
```

- Works well with Express 4.x

---

## 🔹 4. Mongoose (MongoDB ODM)

```bash
npm install mongoose@4.6.8
```

- ✅ Works with MongoDB and Node.js v5
- ❗ Newer versions drop Node 5 support

---

## 🔹 5. Request (HTTP calls — legacy)

```bash
npm install request@2.79.0
```

- Use for making HTTP requests
- ⚠️ Now deprecated, but still works for learning in Node v5

---

## 🔹 6. Nodemon (Dev tool for auto-restart)

```bash
npm install nodemon@1.11.0 --save-dev
```

- Helps in development by restarting app on file changes

---

## 🔹 7. MySQL (If you're using MySQL DB)

```bash
npm install mysql@2.13.0
```

- Fully callback-based and Node.js v5 compatible

---

## 🔹 8. Multer (File Upload Middleware)

```bash
npm install multer@1.2.0
```

- For handling multipart/form-data (file uploads)

---

## 🧪 Optional Testing Tools (if needed)

## Mocha (Test runner)

```bash
npm install mocha@3.1.2 --save-dev
```

## Chai (Assertions)

```bash
npm install chai@3.5.0 --save-dev
```

---

## 📁 Example `package.json` for Node.js v5 Project

```json
{
  "name": "node5-bluebird-app",
  "version": "1.0.0",
  "dependencies": {
    "bluebird": "3.4.7",
    "express": "4.14.0",
    "body-parser": "1.15.2",
    "mysql": "2.13.0",
    "mongoose": "4.6.8",
    "multer": "1.2.0",
    "request": "2.79.0"
  },
  "devDependencies": {
    "nodemon": "1.11.0",
    "mocha": "3.1.2",
    "chai": "3.5.0"
  }
}
```

---

## 🚀 Tip: Lock Node.js version with `nvm`

If you’re using [`nvm`](https://github.com/coreybutler/nvm-windows) (Node Version Manager for Windows):

```bash
nvm install 5.12.0
nvm use 5.12.0
```

Then install your packages.

---
