# Multi Signature Fullstack APP

Simple monorepo of a multi signature app. 

## Repository Organization

### `./packages/*` — Contains the specific repos that constitute this monorepo

### `./packages/frontend/*` — Next.js app

### `./packages/contracts/*` — Solidity smart contracts (Foundry)


## Running the Project Locally

### Prerequisites

- **Node.js**: v18 or higher (LTS recommended). Install from [nodejs.org](https://nodejs.org).
- **pnpm**: v8 or higher (package manager for monorepo). Install with `npm i -g pnpm`.
- **Foundry**: Latest stable version (includes forge, cast, anvil). Install with `curl -L https://foundry.paradigm.xyz | bash` (see [Foundry docs](https://book.getfoundry.sh/getting-started/installation) for details).
- **Git**: For cloning the repo.

**Recommended:** 

While the repo is IDE agnostic, its being developed using VSCode:
- [Solidity extension from Nomic Foundation](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity) (remappings, and language highlighting)
- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [Tailwind](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extensions for the frontend

### 0.1 Install dependencies:

```bash
pnpm install
```

### 0.2 Set-up Keystore:

For local (Anvil), no wallet setup is needed. For real networks, set up a secure keystore:

```bash
pnpm wallet:list # See your accounts already setted up
```
If no account or new account needed you can create one with:
```bash
pnpm wallet:setup
```
This will:
- Create an account in cast keystore
- Saves to .env.local (git-ignored) keystore password and account address
- Forge scripts will use the variables from your .env.local
- This WILL NOT leave traces of your pk in bash history, and it won't save the pk anywhere. (see script for more details)


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

### 2. Build, deploy contracts & start the frontend

```bash
pnpm run dev
```
- This builds and runs your deployment script `forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast`
- The build step generate contract artifacts in `./packages/contracts/out`. The contract abis are in the artifacts
- Frontend consumes those contract artifacts
- Runs frontend next app `next dev` 
- You can now open http://localhost:3000 (or the port shown). The frontend should connect automatically to Anvil (http://127.0.0.1:8545).

## Deploying Contracts to a "real" Network

> _We will use sepolia as an example of a real network_

For real networks, deployments should be handled carefully to ensure security, traceability, and verifiability. 

This is different from local Anvil deployments, where everything can be automated and overwritten freely. 
On real networks:
- Use a secure keystore for signing (no plaintext keys).
- Track deployments manually in the packages/contracts/deployments/ folder to avoid accidental overwrites and maintain an audit trail.
- Verify contracts on Etherscan to make source code public, enable API interactions, and build trust (important for demos, audits, or production).

### `deployments/` folder
The deployments/ folder (e.g., deployments/sepolia.json) serves as a manual record of your deployed contracts.
It includes addresses, constructor args, timestamps, and other data for: 
- **Debugging**: find addresses and args for testing or troubleshooting.
- **Verification**: Copy-paste args for Etherscan verification.
- **Frontend integration**: Frontend can import this JSON to know addresses on different chains.
- **Audit trail**: Git history shows when and how deployments happened — prevents losing data in automated overwrites.

For real networks, update this file manually after deployment (using terminal output). 
Do not automate it: deploying should be a very intentional process.

### Why verify contracts?
Verification on Etherscan (or similar explorers) is good for:
- **Transparency**: Public source code shows the contract matches what you claim.
- **Usability**: Etherscan generates read/write interfaces, ABIs, and event logs.
- **Security**: Auditors/recruiters can review bytecode matches source.
- **Best practice**: Unverified contracts look unprofessional and can raise red flags.
- **Backup**: Contract code, abi, etc will be on etherscan (way easier than grabbing it from the blockchain)

_Always verify after deployment — it's a one-time step per contract._

### Steps to deploy to Sepolia

1. **Setup keystore** (do once for Sepolia)

   ```bash
   pnpm wallet:setup
   ```

   - Enter network: `sepolia`
   - Paste private key when cast prompts
   - Set password
   - Saves to `.env.local` (git-ignored) as `PASS_MULTISIG_SEPOLIA` and `ADDRESS_MULTISIG_SEPOLIA`

2. **Deploy**

   ```bash
   pnpm deploy:sepolia
   ```

   - Uses your keystore + password from `.env.local`
   - Deploys to Sepolia
   - Attempts automatic verification (`--verify`)
   - If auto-verify fails (e.g., complex args), use manual verification (step 4)

   > **🚨 If deploying to a new network it is required to create the script in the package.json following deploy:sepolia example**

3. **Manually update deployments/sepolia.json**

   - Use terminal output from deploy (addresses, args, timestamp, tx hash)
   - Paste into `packages/contracts/deployments/sepolia.json` (use example.json as template)
   - Commit intentionally:

     ```bash
     git add packages/contracts/deployments/sepolia.json
     git commit -m "Add Sepolia deployment"
     ```

4. **Manual verification (if auto-verify failed)**

   For each contract:

   ```bash
   forge verify-contract \
     --chain-id 11155111 \
     --etherscan-api-key $ETHERSCAN_API_KEY \
     --constructor-args $(cast abi-encode "constructor(args)" "arg1" "arg2") \  # from JSON
     0xYourAddress \
     src/YourContract.sol:YourContract
   ```

   Or use Etherscan website (copy from JSON):
   - Address
   - Compiler version (v0.8.31)
   - Source path
   - Constructor args (hex)
   - Flatten source with `forge flatten src/YourContract.sol`

Deployments to real networks are tracked in git — never overwritten automatically to prevent data loss.

# TODO:

- Front can read and write to the blockchain
   - We will create a pool and load that pool with both tokens to allow for a demo
      - Our script deploys both tokens and pool already
      - Our script must load the pool with liquidity
   - We need a faucet or a paymaster to pay for the users network gas.
   - User will create his own mutlisg wallet
      - He will create or add to the multisig wallet multiple wallets he should control
      - Our UI should allow user to open multiple iframes or tabs or components to allow him to handle all the wallets at the same time ←←←
   - We will give that multisg wallet some tokens to interact with the pool. (automatically or via user interaction)
   - User will propose approval and transaction for that wallet
   - User(s) will sign tx
   - Once all signatures collected, user will be able to send signatures to executeTx
   - Multisig wallet will swap in the pool

- packages/frontend/app/lib/contracts/contracts.ts needs dev vs prod settings
