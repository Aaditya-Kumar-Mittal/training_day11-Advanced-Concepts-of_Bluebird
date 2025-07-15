var fs = require("fs");

var Promise = require("bluebird");

// Promisifying the readFile function to use it with async/await
// This allows us to use fs.readFileAsync instead of fs.readFile
fs.readFileAsync = Promise.promisify(fs.readFile);

function delayedTask(item) {
  return new Promise(function (resolve) {
    console.log("Processing Started for item:", item);

    setTimeout(function () {
      console.log("Processed item:", item);
      resolve(item);
    }, 1000);

    console.log("Processing Ended for item:", item);
  });
}

Promise.map(["item1", "item2", "item3"], function (item) {
  return delayedTask(item);
})
  .then(function (results) {
    console.log("All items processed:", results);
  })
  .catch(function (error) {
    console.error("Error processing items:", error);
  });
