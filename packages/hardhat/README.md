# Farmblock-latest - Smart Contracts

This directory contains the smart contracts for Farmblock-latest, built with Hardhat and optimized for the Celo blockchain.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Compile contracts
pnpm compile

# Run tests
pnpm test

# Deploy to Sepolia testnet (chainId 11142220)
pnpm deploy:sepolia

# Deploy to Celo mainnet
pnpm deploy:celo
```

## 📜 Available Scripts

- `pnpm compile` - Compile smart contracts
- `pnpm test` - Run contract tests
- `pnpm deploy` - Deploy to local network
- `pnpm deploy:alfajores` - Deploy to Celo Alfajores testnet
- `pnpm deploy:celo` - Deploy to Celo mainnet
 - `pnpm deploy:sepolia` - Deploy to Sepolia testnet (chainId 11142220)
- `pnpm verify` - Verify contracts on Celoscan
- `pnpm clean` - Clean artifacts and cache

## 🌐 Networks

### Celo Mainnet
- **Chain ID**: 42220
- **RPC URL**: https://forno.celo.org
- **Explorer**: https://celoscan.io

### Alfajores Testnet
- **Chain ID**: 44787
- **RPC URL**: https://alfajores-forno.celo-testnet.org
- **Explorer**: https://alfajores.celoscan.io
- **Faucet**: https://faucet.celo.org

### Sepolia Testnet (preferred for test deployments in this project)
 - **Chain ID**: 11142220
- **RPC URL**: Set via `CELO_SEPOLIA_URL` in `.env` (example provided in `.env.example`)
- **Explorer/Verification**: Use Etherscan Sepolia (set `ETHERSCAN_API_KEY` in `.env`)

## 🔧 Environment Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Fill in your private key and API keys (see `packages/hardhat/.env.example`):
   ```env
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   CELO_SEPOLIA_URL=https://your-sepolia-rpc-provider
      CELO_SEPOLIA_CHAIN_ID=11142220
   ```

## 📁 Project Structure

```
contracts/          # Smart contract source files
├── Lock.sol        # Sample timelock contract

test/              # Contract tests
├── Lock.ts        # Tests for Lock contract

ignition/          # Deployment scripts
└── modules/
    └── Lock.ts    # Lock contract deployment

hardhat.config.ts  # Hardhat configuration
tsconfig.json      # TypeScript configuration
```

## 🔐 Security Notes

- Never commit your `.env` file with real private keys
- Use a dedicated wallet for development/testing
 - Test thoroughly on Sepolia (chainId 11142220) before mainnet deployment
- Consider using a hardware wallet for mainnet deployments

## 📚 Learn More

- [Hardhat Documentation](https://hardhat.org/docs)
- [Celo Developer Documentation](https://docs.celo.org)
- [Celo Smart Contract Best Practices](https://docs.celo.org/developer/contractkit)
- [Viem Documentation](https://viem.sh) (Ethereum library used by Hardhat)
