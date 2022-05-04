import { readFile, writeFile } from "fs/promises";
import moment from "moment";
import { path } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(path);

async function cutVideo({ startTime, endTime, videoName, subtitleName }) {
  const start = moment(new Date(`2000.01.01 ${startTime}`));
  const end = moment(new Date(`2000.01.01 ${endTime}`));
  const secondsDiff = end.diff(start, "seconds");
  ffmpeg(`input/${videoName}`)
    .setStartTime(startTime)
    .setDuration(secondsDiff)
    .output(`./output/${videoName}`)
    .on("end", (err) => {
      if (err) return console.log("conversion error");
      cutSubTitle({ startTime, endTime, subtitleName });
    })
    .run();
}

async function cutSubTitle({ startTime, endTime, subtitleName }) {
  const rows = (await readFile(`./input/${subtitleName}`))
    .toString()
    .split(/[\n\r]/g);
  let phrases = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.indexOf("-->") === -1 || row == "") continue;
    const currentStartTime = row.slice(0, 8);
    const currentFinalTime = row.slice(17, 25);
    if (
      (currentStartTime >= startTime && currentStartTime <= endTime) ||
      (currentFinalTime >= startTime && currentFinalTime <= endTime)
    ) {
      phrases.push(rows[i + 2]);
    }
  }
  phrases = phrases.join("\n");
  await writeFile(`./output/${subtitleName}`, phrases);
}

export { cutVideo };
