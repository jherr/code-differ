// Make sure to have default tracking set to "optical" in AfterEffects

const fs = require("node:fs/promises");
const sendToAE = require("./send");

(async () => {
  const data = JSON.parse(await fs.readFile(process.argv[2], "utf8"));
  await sendToAE(data);
})();
