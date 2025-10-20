import type { HardhatUserConfig } from "hardhat/config";
// Load .env from the package so process.env values are available when running hardhat
import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Celo Mainnet
    celo: {
      url: "https://forno.celo.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 42220,
    },
    // Celo Alfajores Testnet
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 44787,
    },
    // Local development
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // Celo Sepolia testnet (use CELO_SEPOLIA_URL env var)
    sepolia: {
      url: process.env.CELO_SEPOLIA_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      // Optional: set CELO_SEPOLIA_CHAIN_ID in env if you want to force a chain id
  chainId: process.env.CELO_SEPOLIA_CHAIN_ID ? Number(process.env.CELO_SEPOLIA_CHAIN_ID) : 11142220,
    },
    // Alias that some docs/tools use
    celoSepolia: {
      url: process.env.CELO_SEPOLIA_URL || "https://rpc.sepolia.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: process.env.CELO_SEPOLIA_CHAIN_ID ? Number(process.env.CELO_SEPOLIA_CHAIN_ID) : 11155111,
    },
  },
  etherscan: {
    apiKey: {
      celo: process.env.CELOSCAN_API_KEY || "",
      alfajores: process.env.CELOSCAN_API_KEY || "",
      // Support Etherscan Sepolia verification (use ETHERSCAN_API_KEY or CELOSCAN_API_KEY)
      sepolia: process.env.ETHERSCAN_API_KEY || process.env.CELOSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
      {
        network: "sepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};

export default config;
