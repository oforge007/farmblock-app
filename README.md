README.md
# FarmBlock - Decentralized Sustainable Agriculture on Celo

**FarmBlock** is a decentralized application (DApp) on Celo that empowers communities to combat global hunger and drought through sustainable agriculture. By leveraging blockchain technology, FarmBlock enables local farmers to create farmsteads (FarmBlocks), mint NFTs tied to real agro-products (e.g., quinoa, millets, goji berries), and trade yields transparently using stablecoins (cUSD, cKES, cEUR). Our mission is to build a global economy centered on financial inclusion, community governance, and agricultural sustainability.



FarmBlock integrates with MiniPay
( https://github.com/celo-org/minipay-template) for seamless stablecoin payments, Gardens V2 (https://github.com/1Hive/gardens-v2)  for decentralized governance, Mento for yield generation, thirdweb for NFT functionality, Warpcast for transparency, and MapBox for geotagging farm locations. 


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



## Prerequisites
- **Node.js**: v20 or higher
- **Git**: v2.38 or higher
- **pnpm**: For package management
- **MetaMask or MiniPay Wallet**: For interacting with Celo
- **Celo Testnet Funds**: Get test tokens from the [Celo Faucet](https://faucet.celo.org/) for Alfajores testnet
- **WalletConnect Cloud Project ID**: For wallet connections (get from [WalletConnect Cloud](https://cloud.walletconnect.com/))
- **MapBox Access Token**: For geotagging (get from [MapBox](https://www.mapbox.com/))



## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/oforge007/farmblock-app.git
   cd farmblock-dapp

2. **Install Dependencies**:

 pnpm install


3. **Configure Environment Variables**:


Smart Contracts:


Rename packages/hardhat/env.template to packages/hardhat/env and add your PRIVATE_KEY.

 PRIVATE_KEY=your_private_key




Frontend:


Rename packages/react-app/.env.template to packages/react-app/.env and add your WalletConnect Cloud Project ID and MapBox Access Token.

 NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token


4. **Fund Your Wallet**:


Ensure your wallet has test tokens for Celo Alfajores (from the Celo Faucet).






## Usage

1. **Deploy Smart Contracts**:


Navigate to the Hardhat package:

 cd packages/hardhat


Deploy the contracts to Celo Alfajores:

 npx hardhat ignition deploy ./ignition/modules/FundingPool.js --network alfajores
npx hardhat ignition deploy ./ignition/modules/FarmBlockYieldDepositor.js --network alfajores


2. **Start the Frontend**:


Navigate to the React app package:

 cd packages/react-app


Start the development server:

 yarn dev


Open http://localhost:3000 in a browser (preferably Opera Mini for MiniPay compatibility).


3. **Interact with FarmBlock**:


Connect your MiniPay wallet to the app.


Create a FarmBlock community (via Gardens V2).


Use the TaskManager to create and complete tasks.


Mint and trade agro-product NFTs in the NFT store.


Deposit funds into Mento yield pools and withdraw based on community approval.


Share updates via Warpcast and explore FarmBlock locations with MapBox.







## Smart contracts

* FundingPool.sol: Manages task rewards, restricted to Mento stablecoins (cUSD, cKES, cEUR).


Deployed at: [TBD after deployment]


* FarmBlockYieldDepositor.sol: Handles deposits and withdrawals to/from Mento stablecoin yield pools, triggered by Gardens V2 signal pool approvals.


Deployed at: [TBD after deployment]


* NFT Contract: Deployed via thirdweb for minting agro-product NFTs.


Deployed at: [TBD after deployment]




## Governance


FarmBlock uses Gardens V2’s Circles governance model:
* Values: Sustainability, transparency, community empowerment.


* Membership: Open to farmers, Guardians, and NFT holders who register onchain (via Celo SocialConnect) and verify humanity (via Self).


* Council: Each FarmBlock forms a Circle with a Council of Guardians, elected by NFT holders, to manage tasks and funds.


* Delegation: Guardians can delegate tasks to community members.


* Lazy Consensus: Proposals (e.g., fund withdrawals) are approved unless objected to within a set period.


**Signal Pools**: Used to approve withdrawals from yield pools, ensuring community consensus.



## Integrations



* MiniPay: Enables stablecoin payments (cUSD, cKES, cEUR) for task rewards and NFT purchases.


* Gardens V2: Provides modular governance pools for task management and fund allocation.


* Mento Router: Facilitates swaps for yield pool deposits/withdrawals (e.g., cUSD → cKES).


* thirdweb: Powers the NFT store for minting and trading agro-product NFTs.


* Warpcast: Shares live updates on FarmBlock activities for transparency.


* MapBox: Geotags FarmBlock locations for discovery and visualization.




## Contributing


We welcome contributions from the community! To get started:
1. Fork the repository.


2. Create a new branch (git checkout -b feature/your-feature).


3. Make your changes and commit (git commit -m "Add your feature").


4. Push to your fork (git push origin feature/your-feature).


5. Open a Pull Request with a detailed description of your changes.



**Suggested Contributions**


* Add unit tests for smart contracts (FundingPool.sol, FarmBlockYieldDepositor.sol).


* Optimize MapBox performance for mobile users.


* Enhance Warpcast integration with real-time notifications.


* Improve UI/UX for the TaskManager and NFT store.


See CONTRIBUTING.md for more details.



## Roadmap



* Phase 1 (MiniPay Hackathon - May 2025):


	* Deploy MVP on Celo Alfajores with TaskManager, NFT store, and yield pool integration.


	* Integrate MiniPay for stablecoin payments.


	* Submit to MiniPay hackathon.


* Phase 2 (Q2 2025):


	* Launch on Celo mainnet and enable Divvi rewards.


	* Expand Mento stablecoin support (e.g., add cBRL for Brazil).


	* Onboard 100 farmers and create 10 FarmBlocks.


* Phase 3 (Q3 2025):


	* Scale to 1,000 farmers across Sub-Saharan Africa.


	* Add advanced features: yield pool analytics, automated Warpcast notifications.


	* Partner with NGOs for broader impact.


## License

Copyright 2025 Jordan Ofurum


Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the “Software”), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.





## Contact
* Project Lead: Jordan Ofurum - jordan.ofurum@gmail.com


* Twitter/X: https://x.com/@0xfarmBlock


* Discord: Join our server at https://discord.gg/cqnGmezr


* Gardens Funding Pool: Support us at https://app.gardens.fund/gardens/42220/0x765de816845861e75a25fca122bb6898b8b1282a/0x60558c002f0d08451a5f5ea983b3ea44e35f6500





