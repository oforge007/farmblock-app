# FarmBlock - Decentralized Sustainable Agriculture on Celo

**FarmBlock** is a decentralized application (DApp) on Celo that empowers communities to combat global hunger and drought through sustainable agriculture. By leveraging blockchain technology, FarmBlock combines governance, finance, and transparency tools to create a sustainable ecosystem.

FarmBlock integrates with MiniPay
( https://github.com/celo-org/minipay-template) for seamless stablecoin payments, Gardens V2 (https://github.com/1Hive/gardens-v2) for decentralized governance, Mento for yield generation, thirdweb for NFT minting and trading, Warpcast for transparency, MapBox for geotagging, and Self for zk proof of personhood verification.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contracts](#smart-contracts)
- [Governance](#governance)
- [Integrations](#integrations)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

## Features
- **Community-Driven Peer Bank**: A multisig wallet (FarmBlock Safe) funds task rewards and yield trading, managed by Guardians through decentralized governance.
- **TaskManager**: Farmers and Guardians create, track, and complete tasks (e.g., planting, harvesting), with rewards distributed via Gardens V2 funding pools.
- **NFT Store**: Mint and trade NFTs tied to agro-products using thirdweb, with payments in Mento stablecoins (cUSD, cKES, cEUR).
- **Yield Generation**: Guardians deposit funds into Mento stablecoin yield pools to earn returns, with withdrawals approved via Gardens V2 signal pools.
- **Transparency**: Live updates on FarmBlock activities (e.g., task completions, yield reports) are shared via Warpcast.
- **Geotagging**: MapBox integration allows users to discover and visualize FarmBlock locations globally.
- **Financial Inclusion**: MiniPay enables unbanked farmers to pay for services (e.g., task rewards, NFT purchases) using stablecoins.
- **Humanity Verification**: Self protocol integration provides zk proof of personhood verification for community members.

## Architecture
FarmBlock is built on Celo, leveraging the following components:
- **Frontend**: A NextJS app (from the MiniPay template) for a mobile-friendly interface, compatible with Opera Mini.
- **Smart Contracts**:
  - `FundingPool.sol`: Manages task rewards (via Gardens V2).
  - `FarmBlockYieldDepositor.sol`: Handles deposits/withdrawals to Mento stablecoin yield pools.
  - NFT contracts (via thirdweb) for minting agro-product NFTs.
- **Governance**: Gardens V2’s Circles model, with funding and signal pools for task management and fund withdrawals.
- **Integrations**:
  - Mento Router: Swaps for yield pool deposits/withdrawals.
  - thirdweb: NFT minting and trading.
  - Warpcast: Transparency updates.
  - MapBox: Geotagging farm locations.
  - Self: zk proof of personhood verification.