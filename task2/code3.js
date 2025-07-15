var Promise = require("bluebird");

function delay(ms, value) {
  return new Promise(function (resolve, reject) {
    // if (value === 2) {
    //   return reject(new Error("Rejected Promise for Value 2"));
    // }
    setTimeout(function () {
      resolve(value);
    }, ms);
  });
}

Promise.props({
  user: delay(500, { id: 1, name: "Alice" }),
  settings: delay(1000, { theme: "dark", notifications: true }),
  logs: delay(700, ["Login", "View Dashboard"]),
})
  .then(function (results) {
    console.log("All the promises resolved : ", results);
    console.log("user: ", results.user);
    console.log("settings: ", results.settings);
    console.log("logs: ", results.logs);
  })
  .catch(function (error) {
    console.error("An error occurred: ", error);
  });
