var Promise = require("bluebird");

function delay(ms, value) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

Promise.props({
  a: delay(1000, 1),
  b: delay(2000, 2),
  c: delay(3000, 3),
})
  .then(function (results) {
    console.log("All the promises resolved : ", results);
    console.log("a: ", results.a);
    console.log("b: ", results.b);
    console.log("c: ", results.c);
  })
  .catch(function (error) {
    console.error("An error occurred: ", error);
  });
