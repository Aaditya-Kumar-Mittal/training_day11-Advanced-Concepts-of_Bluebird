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