# Multi Signature Fullstack APP

Simple monorepo of a multi signature app. 

## Repository Organization

### `./packages/*` — Contains the specific repos that constitute this monorepo

### `./packages/frontend/*` — Next.js app

### `./packages/contracts/*` — Solidity smart contracts (Foundry)


## Running the Project Locally

### Prerequisites

- Node.js ≥ 18
- pnpm (recommended) or npm/yarn
- Foundry (latest stable): https://book.getfoundry.sh/getting-started/installation

**Recommended:** 

While the repo is IDE agnostic, its being developed using VSCode:
- [Solidity extension from Nomic Foundation](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) (remappings, and language highlighting)
- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [Tailwind](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extensions for the frontend

### 0. Install dependencies:

```bash
pnpm install
```

### 1. Start a local Anvil node 

Anvil is a local Ethereum node provided by Foundry.

```bash
# In a separate terminal
anvil 
```
_Leave this running._ 
- Chain Id: 31337
- It listens on http://127.0.0.1:8545 (port 8545)
- Default accounts (first 10 private keys are printed in the terminal).

### 2. Build, deploy contracts & generate ABIs

```bash
pnpm deploy-local
```
- This builds the contracts `forge build`

- Runs your deployment script `forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast`

- Copies all all .json artifacts from `./packages/contracts/out/` to `./apps/frontend/lib/abis/`

After running, look in the terminal output for the deployed wallet address (usually printed by your Deploy.s.sol script via console.log).

### 3. Start the frontend

```bash
# In a new terminal
pnpm dev
```
Open http://localhost:3000 (or the port shown). The frontend should connect automatically to Anvil (http://127.0.0.1:8545).


