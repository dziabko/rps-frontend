import styles from './DiscoverWalletProviders.module.css'
import { useState, useEffect } from 'react'
import { useSyncProviders } from '../hooks/useSyncProviders'
import { formatAddress } from '../utils'
import * as chains from 'viem/chains'


function DiscoverWalletProviders({ setSelectedWallet, selectedWallet, onSetUserAccountChange, userAccount, setProvider, provider }) {
  // const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>()
  // const [userAccount, setUserAccount] = useState<string>('')
  const [chainId, setChainId] = useState<string>('')
  const [chainName, setChainName] = useState<string>('')
  const providers = useSyncProviders()

  console.log('providers', providers)


  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        console.log("CHAINID: " + chainId)
        setChainId(chainId)
        setChainName(getChain(parseInt(chainId)).name)
        // window.location.reload();
      })
    }
  })

  const handleConnect = async (providerWithInfo: EIP6963ProviderDetail) => {
    setProvider(provider)
    // console.log('providerWithInfo', providerWithInfo)
    // console.log('provider', providerWithInfo.provider)
    const accounts = await providerWithInfo.provider
      .request({ method: 'eth_requestAccounts' })
      .catch(console.error)

    const chainId = await providerWithInfo.provider
      .request({ method: 'eth_chainId' })
      .catch(console.error)

    if (accounts?.[0] && chainId?.[0]) {
      setSelectedWallet(providerWithInfo)
      setChainId(chainId as string)
      setChainName(getChain(parseInt(chainId as string)).name)
      onSetUserAccountChange(accounts?.[0])
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
            <img src={selectedWallet.info.icon} alt={selectedWallet.info.name} />
            <div>{selectedWallet.info.name}</div>
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