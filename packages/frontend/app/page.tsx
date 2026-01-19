import MultiSignatureWallet from "@contracts/out/MultiSignatureWallet.sol/MultiSignatureWallet.json"

/**
 * 
 * ================
 * 1. Use the path aliases to print the ABIs 
 * 2. If everything works commit
 * 3. Install wagmi and viem
 * 4. Keep on rolling
 * ================
 * 
 */

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
       <div> {JSON.stringify(MultiSignatureWallet.abi)} </div>
      </main>
    </div>
  );
}
