const EventEmitter = require("node:events");
class SchoolBell extends EventEmitter {}

const schoolBell = new SchoolBell();
schoolBell.on("ring", () => {
  console.log("Bell is ringed!");
});

schoolBell.on("broken", () => {
  console.log("Bell is broken");
});
schoolBell.emit("ring");
schoolBell.emit("broken");
