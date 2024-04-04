import styles from './DiscoverWalletProviders.module.css'
import { useState, useEffect } from 'react'
import { useSyncProviders } from '../hooks/useSyncProviders'
import { formatAddress } from '../utils'
import * as chains from 'viem/chains'


function DiscoverWalletProviders({ setSelectedWallet, selectedWallet, onSetUserAccountChange, userAccount }: {
  setSelectedWallet: (wallet: EIP6963ProviderDetail) => void,
  selectedWallet: EIP6963ProviderDetail | undefined,
  onSetUserAccountChange: (account: string) => void,
  userAccount: string
}) {
  // const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>()
  // const [userAccount, setUserAccount] = useState<string>('')
  const [chainId, setChainId] = useState<string>('')
  const [chainName, setChainName] = useState<string>('')
  const providers = useSyncProviders()
  // const [provider, setProvider] = useState<EIP1193Provider>();

  console.log('providers', providers)


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (ChainId) => {
        console.log("CHAINID: " + chainId)
        setChainId(ChainId)
        setChainName(getChain(parseInt(ChainId as string)).name)
        // window.location.reload();
      })
    }
  })

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    // setProvider(providerWithInfo.provider)
    // console.log('providerWithInfo', providerWithInfo)
    // console.log('provider', providerWithInfo.provider)
    const accountsReq = await (providerWithInfo.provider
      .request({ method: 'eth_requestAccounts' }) as Promise<string[]>)
      .catch(console.error)

    const accounts = accountsReq as string[]

    const chainId = await providerWithInfo.provider
      .request({ method: 'eth_chainId' })
      .catch(console.error)

    if (accounts && accounts?.[0] && chainId) {
      setSelectedWallet(providerWithInfo)
      setChainId(chainId as string)
      setChainName(getChain(parseInt(chainId as string)).name)
      onSetUserAccountChange(accounts[0] as string)
    }
  }

  function getChain(chainId: number) {
    for (const chain of Object.values(chains)) {
      if ('id' in chain) {
        if (chain.id === chainId) {
          return chain;
        }
      }
    }
    throw new Error(`Chain with id ${chainId} not found`);
  }

  return (
    <>
      <h2>Wallets Detected:</h2>
      <div className={styles.display}>
        {
          providers.length > 0 ? providers?.map((provider: EIP6963ProviderDetail) => (
            <button id="submitBtn" key={provider.info.uuid} onClick={() => handleConnect(provider)} >
              <img src={provider.info.icon} alt={provider.info.name} />
              <div>{provider.info.name}</div>
            </button>
          )) :
            <div>
              there are no Announced Providers
            </div>
        }
      </div>
      <hr />
      <h2 className={styles.userAccount}>{userAccount ? "" : "No "}Wallet Selected</h2>
      {userAccount &&
        <div className={styles.walletDetails}>
          <div className={styles.logo}>
            <img src={selectedWallet?.info.icon} alt={selectedWallet?.info.name} />
            <div>{selectedWallet?.info.name}</div>
            <div>({formatAddress(userAccount)})</div>
            {/* <div><strong>uuid:</strong> {selectedWallet.info.uuid}</div> */}
            {/* <div><strong>rdns:</strong> {selectedWallet.info.rdns}</div> */}
            <div><strong>Chain:</strong> {chainName}</div>
          </div>
        </div>
      }
    </>
  )
}

export default DiscoverWalletProviders