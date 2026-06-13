# FarmBlock – Restoring Zion

**On-Chain Infrastructure for FarmBlock**    

**Mission:** To restore the Earth through transparent, community-governed, regenerative agriculture on the Celo blockchain.

[![Vercel Deployment](https://vercel.com/button)](https://farmblock.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is FarmBlock?

FarmBlock turns traditional farmsteads into **on-chain cooperatives** where farmers, youth, and global supporters co-own and govern productive assets.


It combines:
- **zk-proof identity** → Sybil-resistant onboarding  
- **NFT-based membership shares** → Fractional ownership & fundraising  
- **Gnosis Safe multisig treasury** → Trustless fund management  
- **Task-to-Earn engine** → Reputation-weighted rewards for farm work  
- **Peer-validated Casts** → Proof-of-impact without expensive IoT  
- **Regenerative payments** → USDm, USDT, USDC via MiniPay  

All wrapped in a **registered Multipurpose Cooperative** so on-chain decisions are legally binding.

Live Demo → https://farmblock.vercel.app

---

## Core Flow

1. **Onboarding**  
   - Self zk-proof verification (prove humanity + LGA residency)  
   - Mint soulbound "Verified Farmer" badge (general FarmBlock level)

2. **FarmBlock Creation**  
   - Verified Guardian initiates → Multisig approval (3-of-5)  
   - Deploys: ERC-721 NFT collection + linked Gnosis Safe treasury

3. **Membership & Fundraising**  
   - Guardians mint founder shares free  
   - Public mints via NFT drop (stake USDm chosen by farm holder)  
   - 100% proceeds locked in Safe  
   - Verified farmers can join any specific FarmBlock by minting its NFT

4. **Donation**  
   - Anyone can directly fund a FarmBlock they have high confidence in  
   - Donations sent straight to the Gnosis Safe treasury  
   - Donors see real-time progress via Cast ledger and task updates

5. **Task-to-Earn Economy**  
   - Guardians create a task and choose whether it requires a **materials advance** (for capital-intensive work)  
   - Applicants stake a small amount of USDm to apply  
   - Guardians vote within the set timeframe (e.g., 48 hours)  
   - Unsuccessful applicants receive full stake refund  

   **Two paths after selection:**
   - **No advance needed** → Full reward moves to escrow  
   - **Materials advance required** → 40% of reward is released immediately for equipment purchase (worker uploads proof of purchase Cast)

6. **Task Execution & Proof of Impact**  
   - Worker performs the task  
   - Uploads geo-tagged Cast (photo/video + description)  
   - **Validators** (only verified farmers who own an NFT in **this specific FarmBlock**) physically inspect and submit on-chain proof  
   - Required validator consensus: Guardian sets per task (2-of-3 for low-risk, 3-of-5 for medium, 4-of-7 for high-value)

7. **Challenge Period & Game Theory Payout**  
   - After validator submission, a **48-hour challenge period** begins  
   - Any verified member or NFT holder in the FarmBlock can raise a dispute by staking a small amount (e.g., 2 USDm) and submitting counter-evidence (photo/video + explanation) proving the Cast is fraudulent (fake photo, wrong location, work not completed, etc.)  
   - **If a valid dispute is raised:** Guardians (or all NFT holders) vote on the dispute within 24 hours.  
   - **Resolution outcomes:**  
     - Dispute **fails** → original validator consensus stands; worker and validators are paid; challenger’s stake is slashed.  
     - Dispute **succeeds** → validators who approved the fraudulent Cast have their reputation slashed (-20), their verification fee is clawed back, and the worker’s reward is withheld or reduced. The challenger’s stake is refunded and they may receive a small reward for protecting the treasury.  
   - If no valid dispute is raised and consensus is met:  
     - Smart contract releases remaining reward + original application stake to the worker  
     - Validators receive their verification fee  
   - Reputation updated: +5 success / -20 fraud (slashing applies if fraud proven)

---

## Tech Stack

- Blockchain: Celo (mobile-first, low fees)  
- Wallet: MiniPay / Valora  
- Governance: Gnosis Safe (multisig)  
- Frontend: Next.js / React / Tailwind  
- Hosting: Vercel  
- Identity: zk-proof (self-verification)  
- NFT: ERC-721 for membership shares  
- Payments: USDm, USDT, USDC via MiniPay  

---

## Why FarmBlock?

- Solves **trust & corruption** in community agriculture projects  
- Creates **youth jobs** (validators, workers, Guardians)  
- Enables **global funding** without middlemen  
- Legally compliant via Cooperative bye-laws  
- Mobile-first for rural access  
- Validators are **specific FarmBlock NFT holders** — ensuring skin in the game and true community accountability

---

## Project Status

- MVP live on Vercel: https://farmblock.vercel.app    

---

## License

MIT License – see [LICENSE](./LICENSE)

---

## Contact

Jordan Oforge (@Jay_Oforge)  
X: https://x.com/Jay_Oforge  
Email: jordan.ofurum@gmail.com  
Wallet: oforge.celo.eth

**Built for the restoration of Earth.**  
Powered by Celo and community faith.