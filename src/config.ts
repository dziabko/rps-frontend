import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'



import { createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet, localhost } from 'viem/chains'
 
export const walletClient = createWalletClient({
  chain: localhost,
  transport: custom(window.ethereum)
})
 
// JSON-RPC Account
export const [account] = await walletClient.getAddresses()
// Local Account
// export const account = privateKeyToAccount(...)

const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const Config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})