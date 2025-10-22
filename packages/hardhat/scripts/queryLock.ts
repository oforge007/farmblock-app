import { ethers as Ethers } from "ethers";
import fs from "fs";
import path from "path";

async function main() {
  const address = "0x64B0e675DE532C78BcA9961BA2f9583FD52165dd";
  console.log("Querying Lock at", address);

  // Load CELO_SEPOLIA_URL from environment or .env file
  const envPath = path.resolve(__dirname, "..", ".env");
  let CELO_SEPOLIA_URL = process.env.CELO_SEPOLIA_URL;
  if (!CELO_SEPOLIA_URL && fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, "utf8");
    env.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^(\w+)=(.*)$/);
      if (m) {
        const k = m[1];
        const v = m[2];
        if (k === "CELO_SEPOLIA_URL") CELO_SEPOLIA_URL = v;
      }
    });
  }

  if (!CELO_SEPOLIA_URL) throw new Error("CELO_SEPOLIA_URL not set in env or .env");

  const provider = new Ethers.JsonRpcProvider(CELO_SEPOLIA_URL);

  const artifactPath = path.resolve(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "Lock.sol",
    "Lock.json"
  );
  if (!fs.existsSync(artifactPath)) throw new Error("Lock artifact not found");

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  const lock = new Ethers.Contract(address, abi, provider);

  const owner: string = await lock.owner();
  const unlockTime = await lock.unlockTime();
  const balance = await provider.getBalance(address);

  console.log("owner:", owner);
  console.log("unlockTime (unix):", unlockTime.toString());
  console.log("unlockTime (Date):", new Date(Number(unlockTime.toString()) * 1000).toISOString());
  console.log("balance (CELO):", Ethers.formatEther(balance));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
