var fs = require("fs");

var Promise = require("bluebird");

fs.writeFileAsync = Promise.promisify(fs.writeFile);

var files = [];

for (var i = 1; i <= 10; i++) {
  files.push(
    fs.writeFileAsync("file" + i + ".txt", "Aaditya Kumar Mittal", "utf-8")
  );
}

Promise.all(files)
  .then(function (results) {
    console.log("All files processed successfully:", results);
  })
  .catch(function (error) {
    console.log("Error processing files:", error.message);
  });
