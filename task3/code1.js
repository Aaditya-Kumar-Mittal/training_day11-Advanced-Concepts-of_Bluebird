var fs = require("fs");

var Promise = require("bluebird");

// Promisifying the readFile function to use it with async/await
// This allows us to use fs.readFileAsync instead of fs.readFile
fs.readFileAsync = Promise.promisify(fs.readFile);

var fileNames = ["file1.txt", "file2.txt", "file3.txt"];

Promise.map(fileNames, function (filename) {
  return fs.readFileAsync(filename, "utf8");
})
  .then(function (contents) {
    contents.forEach(function (content, index) {
      console.log("Content of " + fileNames[index] + ":");
      console.log(content);
    });
  })
  .catch(function (err) {
    console.error("Error reading files:", err);
  })
  .finally(function () {
    console.log("All files processed.");
  });
