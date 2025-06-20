const path = require("path");
const fs = require("fs");
console.log(process.argv);

const inputArguments = process.argv.slice(2);
const text = inputArguments.join(" ");
const timeStamp = new Date().toISOString();
if (!text) {
  console.log("Please provide some text to log.");
  console.log("Example : node index.js Hello World");
  process.exit(1);
}
const filePath = path.join(__dirname, "log.txt");
fs.appendFile(
  filePath,
  text + " " + timeStamp + "\n",
  { encoding: "utf-8" },
  () => {
    console.log("Your LOG added successfully");
  }
);
console.log(filePath);
console.log(text);
