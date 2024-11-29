const puppeteer = require("puppeteer-extra");
const { sleep } = require("./util/util");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

const crawler = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "E:\\puppeteer-auto-meta-proxy\\chrome\\win64-116.0.5793.0\\chrome-win64\\chrome.exe", 
    userDataDir: "E:\\puppeteer-auto-meta-proxy\\chrome-profile", 
    args: [
      '--profile-directory=Profile 1', 
      '--no-sandbox', 
    ],
  });

  const page = await browser.newPage();
  const discordToken =
     ""; 
    
  const bypassLocalStorageOverride = (page) =>
    page.evaluateOnNewDocument(() => {

      let __ls = localStorage;

      Object.defineProperty(window, "localStorage", {
        writable: false,
        configurable: false,
        value: __ls,
      });
    });

  console.log(
    "Redirecting to https://discord.com/app ... (May take a few seconds)"
  );

  bypassLocalStorageOverride(page);
  await sleep(9999)
  await page.goto("https://discord.com/app");

  await page.evaluate((token) => {
    localStorage.setItem("token", `"${token}"`);
  }, discordToken);

  await page.goto("https://discord.com/channels/@me");

  console.log("Successfully logged in...");
  await sleep(5000)
  await page.screenshot({ path: "output.png" });
};

crawler().catch(console.error);
