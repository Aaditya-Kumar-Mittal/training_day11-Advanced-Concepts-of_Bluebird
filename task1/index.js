function getMyData(id, delay) {
  return new Promise(function (resolve, reject) {
    if (id === 2) return reject(new Error("Server crashed for ID 2"));
    setTimeout(function () {
      resolve(`Data for ID ${id}`), 500;
    });
  });
}

Promise.all([getMyData(25, 1000), getMyData(2, 1000), getMyData(3, 1000)])
  .then(function (results) {
    console.log("✅ All data fetched successfully:", results);
    console.log(typeof results);
  })
  .catch(function (error) {
    console.error("❌ Error fetching data:", error.message);
  });
