import { upl } from "./utils/cloudinary.js";
import fs from "fs";

async function test() {
  fs.writeFileSync("test.txt", "hello world");
  console.log("Starting upload...");
  const res = await upl("test.txt");
  console.log("Upload result:", res);
}
test();
