var p1 = Promise.resolve(1);
var p2 = Promise.reject("Error in p2");
var p3 = Promise.resolve(3);

// ⚠️ If any promise fails, the whole Promise.all() immediately rejects with the error from the first failed promise.
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(err => console.error(err)); // 