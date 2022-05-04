import { cutVideo } from "./cut.mjs";

const args = process.argv.slice(2);

console.log(args);

if (args[0] === "cut")
  cutVideo({
    videoName: args[1],
    subtitleName: args[2],
    startTime: args[3],
    endTime: args[4],
  });
