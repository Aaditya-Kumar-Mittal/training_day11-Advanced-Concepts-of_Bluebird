var Promise = require("bluebird");

function fakeAPI(index) {
  return new Promise(function (resolve) {
    if (index % 3 === 0) {
      // Simulate an error for every third index
      return resolve(new Error("Error for index " + index));
    }

    console.log("Calling API", index);
    setTimeout(function () {
      console.log("Got Results for ", index);
      resolve("Data from API " + index);
    }, 1000);
  });
}

Promise.map([2, 4, 6, 8, 10, 12], fakeAPI, { concurrency: 2 })
  .then(function (results) {
    // Promise.map() returns results in input order, not execution order.
    console.log("Results:", results);
  })
  .catch(function (error) {
    console.error("❌ Error:", error);
  });
