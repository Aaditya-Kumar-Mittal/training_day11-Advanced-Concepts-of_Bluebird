function getData(id) {
  return new Promise(function (resolve, reject) {
    if (id === 2) return reject(new Error("Server crashed for ID 2"));
    setTimeout(() => resolve(`Data for ID ${id}`), 500);
  });
}

Promise.all([getData(1), getData(2), getData(3)])
  .then(function (data) {
    console.log("✅ Got all data:", data);
  })
  .catch(function (err) {
    console.error("❌ Failed to fetch data:", err.message);
  });
