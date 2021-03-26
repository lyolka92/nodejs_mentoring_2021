import csv from "csvtojson";
import fs from "fs";
import path from "path";
import minimist from "minimist";
import { ParsedArgs } from "minimist";

// Paths
interface IScriptArguments extends ParsedArgs {
  dirName?: string;
  fileName?: string;
}
const argv: IScriptArguments = minimist(process.argv.slice(2));
const dirName = argv.dirName || "./src/homework1/csv/";
const fileName = path.basename(argv.fileName || "nodejs-hw1-ex1.csv", ".csv");
const inputPath = dirName + fileName + ".csv";
const resultPath = dirName + fileName + ".txt";

// Streams
const readStream = fs.createReadStream(inputPath);
const writeStream = fs.createWriteStream(resultPath, "utf-8");

// Error handling
const handler = (error: Error, step: string) =>
  console.error(`⛔️ ${step} error: ${error.message}`);

readStream.on("error", (error) => handler(error, "Read"));
csv().on("error", (error) => handler(error, "Convert"));
writeStream.on("error", (error) => handler(error, "Write"));

// Process visibility
console.time("Execution time");
readStream.on("data", () => console.log("▶️ Conversion is started"));
writeStream.on("close", () => {
  console.log("✅  Conversion is finished");
  console.timeEnd("Execution time");
});

readStream.pipe(csv()).pipe(writeStream);
