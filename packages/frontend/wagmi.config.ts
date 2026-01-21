import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { resolvedContracts } from './app/lib/contracts/contracts'

// import { Abi } from 'viem'
// import broadcast from '@contracts/broadcast/Deploy.s.sol/31337/run-latest.json'
// import { abi } from '@contracts/out/MintableERC20.sol/MintableERC20.json'

// const helpAddress = broadcast.transactions.find(
//   (tx) =>
//     tx.contractName === 'MintableERC20' &&
//     tx.transactionType === 'CREATE' &&
//     tx.arguments?.includes('HELP')
// )?.contractAddress as `0x${string}`

// console.log('helpAddress', helpAddress)

export default defineConfig({
  out: './app/lib/wagmiHooks/generated.ts',
  contracts: resolvedContracts,
  // contracts: [
  //   {
  //     abi: abi as Abi,
  //     address: { 31337: helpAddress },
  //     name: 'MintableERC20',
  //   },
  // ],
  plugins: [react()],
})
