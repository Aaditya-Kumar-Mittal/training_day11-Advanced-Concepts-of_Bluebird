function fakeApi(name, delay) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(`Hello, ${name}!`);
    }, delay);
  });
}


// Promise.all Returns: A Promise. Promise.all waits for all promises to resolve and returns a single Promise that resolves with an array of their results.
Promise.all([
  fakeApi("Alice", 1000),
  fakeApi("Bob", 2000),
  fakeApi("Charlie", 1500),
])
  .then(function (results) {
    console.log(results);
  })
  .catch(function (error) {
    console.error("An error occurred:", error);
  });
