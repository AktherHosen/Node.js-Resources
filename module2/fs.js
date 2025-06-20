const fs = require("fs");
// console.log("task1");

// let text;
// fs.writeFile("./hellow.txt", "Hello World!", { encoding: "utf-8" }, (err) => {
//   if (err) {
//     console.log("error", err);
//     return;
//   }
//   console.log("File written successfully");
// });
// fs.readFile("./hellow.txt", { encoding: "utf-8" }, (err, data) => {
//   if (err) {
//     console.log("error", err);
//     return;
//   }
//   text = data;
//   console.log("data inside callback", data);
// });

// console.log(text);
// console.log("task2");

const readStream = fs.createReadStream("./hellow.txt", { encoding: "utf-8" });
const writeStream = fs.createWriteStream("./hello-world.txt", {
  encoding: "utf-8",
});

readStream.on("data", (data) => {
  console.log(data);
  writeStream.write(data, (err) => {
    if (err) {
      throw Error("Error", err);
    }
  });
});
