import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Welcome to the string inverter! Enjoy 🌈");

export const recursiveReadline = () => {
  rl.question("", (answer: string) => {
    const revertedAnswer = answer.split("").reverse().join("");
    console.log(revertedAnswer + "\n---");
    recursiveReadline();
  });
};

recursiveReadline();

rl.on("close", () => {
  console.log("Have a nice day! Bye 🌻");
  process.exit(0);
});
