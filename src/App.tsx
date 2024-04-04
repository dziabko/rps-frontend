import { useState } from 'react'
import './App.css'
// import DiscoverWalletProviders from './components/DiscoverWalletProviders'
// import { ethers } from 'ethers';
import { RPS_CONTRACT_ABI, RPS_BYTECODE, HASHER_CONTRACT_ABI, HASHER_BYTECODE } from "./configABI"; // Import the CONTRACT_ABI from config.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { WagmiProvider, useAccount, useWalletClient } from 'wagmi'
// import { Config, account } from './config'
// import { Account } from './account'
// import { WalletOptions } from './wallet-options'
// import { goerli } from 'wagmi/chains'
import {
  Address,
  createPublicClient,
  createWalletClient,
  custom,
  parseEther,
  BaseError,
  TransactionExecutionError,
} from 'viem'
import 'viem/window'

import LoadingSpin from "react-loading-spin";







import { ethers } from 'ethers';
const queryClient = new QueryClient();

import { sepolia } from 'viem/chains'

// function ConnectWallet() { 
//   const { isConnected } = useAccount() 
//   if (isConnected) return <Account /> 
//   return <WalletOptions /> 
// } 

function App() {
  // const [provider, setProvider] = useState();
  const [contractAddress, setContractAddress] = useState<Address>();
  const [hasherContractAddress, setHasherContractAddress] = useState<Address>();
  // const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>();
  // const [userAccount, setUserAccount] = useState<string>('')
  const [c1, setC1] = useState(0)
  const [c1Hash, setC1Hash] = useState<string>('')
  const [c2, setC2] = useState(0)
  const [salt, setSalt] = useState<string>()
  const [account, setAccount] = useState<Address>()

  // Input states
  const [stake1, setStake1] = useState(0);
  const [stake2, setStake2] = useState(0);
  const [player2, setPlayer2] = useState<Address>();


  const publicClient = createPublicClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
  })
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum!),
  })


  // useEffect(() => {
  //   const initializeProvider = async () => {
  //     if (window.ethereum) {
  //       await window.ethereum.request({ method: 'eth_requestAccounts' });
  //       const provider = new ethers.providers.Web3Provider(window.ethereum);
  //       setProvider(provider);
  //     }
  //   };

  //   initializeProvider();

  //   const getNetwork = async () => {
  //     if (provider) {
  //       const network = await provider.getNetwork();
  //       setNetwork(network.name);
  //     }
  //   };

  //   getNetwork();


  async function deployContract() {

    const [address1] = await walletClient.requestAddresses()
    setAccount(address1)
    // console.log("ADDRESS: ", address)

    if (account && c1Hash && player2 && stake1) {
      console.log("DEPLOYING RPS@@@@@")




      if (c1Hash && stake1 && player2) {
        const elem  = document.getElementById('loadingSpinner');
        if (elem) {
          elem.style.display = 'block';
        }
        // const { request } = await publicClient.simulateContract({
        //   address: hasherTx.contractAddress,
        //   account: address1,
        //   abi: HASHER_CONTRACT_ABI,
        //   functionName: 'hash',
        //   args: [c1, salt],
        // })



        // const { request } = await walletClient.writeContract({
        //   address: hasherTx.contractAddress,
        //   account: address1,
        //   abi: HASHER_CONTRACT_ABI,
        //   functionName: 'hash',
        //   args: [c1, salt],
        // })
        const hash = await walletClient?.deployContract({
          abi: RPS_CONTRACT_ABI,
          bytecode: RPS_BYTECODE as `0x${string}`,
          account: account,
          value: parseEther(stake1.toString()),
          args: [c1Hash, player2],
        });

        // console.log("HASH: ", hash)
        // setC1Hash(hash)
        const tx = await publicClient.waitForTransactionReceipt({ hash: hash });
        // console.log("DEPLOYED CONTRACT ADDRESS: ", tx.contractAddress);
        if ((tx.contractAddress != undefined || tx.contractAddress != null) && elem != undefined) {
          setContractAddress(tx.contractAddress);
          window.alert("Deployed RPS Address: " + tx.contractAddress)
          elem.style.display = 'none';
        }
      }

    } else {
      window.alert("Please fill in all fields")
    }

  }

  async function callContractFunction() {
    if (contractAddress != undefined && c2 != undefined && stake2 != undefined) {
      // console.log("FOUND CONTRACT: " + contractAddress);

      const [address] = await walletClient.requestAddresses()


      try {
        await walletClient.writeContract({
          address: contractAddress,
          account: address,
          abi: RPS_CONTRACT_ABI,
          functionName: 'play',
          args: [c2],
          value: parseEther(stake2.toString()),
        })
      } catch (err) {
        if (err instanceof BaseError) {
          const transactionExecutionError = err.walk(err => err instanceof TransactionExecutionError)
          if (transactionExecutionError instanceof TransactionExecutionError) {
            const errorName = transactionExecutionError.name
            const message = transactionExecutionError.message
            window.alert("ErrorName: " + errorName +  "\nMessage: " + message)
          }
        }
      }

      // await walletClient.writeContract(request)
    } else {
      window.alert("Please fill in all fields")
    }
  }

  async function solveContract() {
    if (contractAddress != undefined && salt != undefined && c1 != undefined) {
      // console.log("FOUND CONTRACT: " + contractAddress);

      const [address] = await walletClient.requestAddresses()

      if (c1 != undefined && salt != undefined) {
        const { request } = await publicClient.simulateContract({
          address: contractAddress,
          account: address,
          abi: RPS_CONTRACT_ABI,
          functionName: 'solve',
          args: [c1, parseInt(salt)],
        })

        await walletClient.writeContract(request)
      } else {
        window.alert("Please fill in all fields")
      }
    }
  }

  async function handleHash() {

    const [address1] = await walletClient.requestAddresses()
    setAccount(address1)
    setHasherContractAddress("0xe58fE4a822bdf1EEe43e10DEf31Bb5614018939D")

    if (account && hasherContractAddress == undefined) {

      const hasherHash = await walletClient?.deployContract({
        abi: HASHER_CONTRACT_ABI,
        bytecode: HASHER_BYTECODE as `0x${string}`,
        account: account,
        args: [],
      });

      const hasherTx = await publicClient.waitForTransactionReceipt({ hash: hasherHash });

      console.log("DEPLOYED Hasher CONTRACT ADDRESS: ", hasherTx.contractAddress);
      if (hasherTx.contractAddress) {
        setHasherContractAddress(hasherTx.contractAddress);
      }
    }


    if (hasherContractAddress != undefined && c1 != undefined && salt != undefined) {
      const data = await publicClient.readContract({
        address: hasherContractAddress,
        account: address1,
        abi: HASHER_CONTRACT_ABI,
        functionName: 'hash',
        args: [c1, parseInt(salt)],
      });
      console.log("DATA: ", data)
      if (data != undefined) {
        setC1Hash(data.toString())
      }
    }
  }
  async function handleRandomSaltSet() {
    const randomHex = ethers.hexlify(ethers.randomBytes(32))
    setSalt(randomHex)
  }

  async function handleSetPlayer2Address(val: string) {
    setPlayer2(`0x${val.slice(2)}`)
  }
  async function handleSetContractAddress(val: string) {
    setContractAddress(`0x${val.slice(2)}`)
  }



  return (
    // <WagmiProvider config={Config}>
    <>
      <QueryClientProvider client={queryClient}>
        <div>
          <div id="createGameContainer" className="">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl mb-4">Create Game</h2>
              <div>
                <input
                  className="inputContainer"
                  type="number"
                  placeholder="Stake"
                  onChange={(e) => setStake1(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <input
                  className="inputContainer"
                  type="text"
                  placeholder="Player 2"
                  onChange={(e) => handleSetPlayer2Address(e.target.value)}
                />
              </div>

              <div>
                <select className="border-2 border-gray-300 p-2 w-full max-w-xs" value={c1} onChange={(e) => setC1(parseInt(e.target.value))}>
                  <option value={0} selected disabled>
                    Player1 Move
                  </option>
                  <option value={1}>Rock</option>
                  <option value={2}>Paper</option>
                  <option value={3}>Scissors</option>
                  <option value={4}>Spock</option>
                  <option value={5}>Lizard</option>
                </select>
              </div>
              <div>
                <div className='inputWithButton'>
                  <input
                    className="inputContainerSalt"
                    type="text"
                    placeholder="Salt"
                    value={salt}
                    disabled={true}
                  />
                  <button onClick={() => handleRandomSaltSet()}>Random</button>
                </div>
              </div>
              <div>
                <input
                  className="inputContainer"
                  type="text"
                  placeholder="Keccak256(move, salt)"
                  disabled={true}
                  value={c1Hash}
                />
              </div>
              <div>
                <button onClick={() => handleHash()}>Hash(c1, salt)</button>
                {/* <div>Result: {c1Hash}</div> */}
              </div>
              <div id="submitContainer">

                <button type="submit" id="submitBtn" className="border-2 border-gray-300 p-2 w-full max-w-xs" onClick={deployContract}>Create</button>

                <div id="loadingSpinner" className="flex">
                  <LoadingSpin
                  size={'25px'}/>
                 </div>
              </div>
            </div>
          </div>
          <div id="player2TurnContainer" className="border-2 border-gray-300 p-6 rounded-md">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl mb-4">Player 2 Turn</h2>
              <div>
                <input
                  className="inputContainer"
                  type="text"
                  placeholder="RPS Contract Address"
                  onChange={(e) => handleSetContractAddress(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="inputContainer"
                  type="text"
                  placeholder="Stake"
                  onChange={(e) => setStake2(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <select className="border-2 border-gray-300 p-2 w-full max-w-xs" value={c2} onChange={(e) => setC2(parseInt(e.target.value))}>
                  <option value="" selected disabled>
                    Player2 Move
                  </option>
                  <option value={1}>Rock</option>
                  <option value={2}>Paper</option>
                  <option value={3}>Scissors</option>
                  <option value={4}>Spock</option>
                  <option value={5}>Lizard</option>
                </select>
              </div>
              <button type="submit" id="submitBtn" className="border-2 border-gray-300 p-2 w-full max-w-xs" onClick={() => callContractFunction()}>Play</button>
            </div>
          </div>
          <div id="player1TurnContainer" className="border-2 border-gray-300 p-6 rounded-md">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl mb-4">Player 1 Solve</h2>
              {/* <div>{"Player 1 Address: " + userAccount}</div> */}
              <div className='w-full'>
                <input
                  className="inputContainer"
                  type="text"
                  placeholder="RPS Contract Address"
                  value={contractAddress}
                  onChange={(e) => handleSetContractAddress(e.target.value)}
                />
              </div>
              <div>
                <select className="border-2 border-gray-300 p-2 w-full max-w-xs" value={c1} onChange={(e) => setC1(parseInt(e.target.value))}>
                  <option value={0} selected disabled>
                    Player1 Move
                  </option>
                  <option value={1}>Rock</option>
                  <option value={2}>Paper</option>
                  <option value={3}>Scissors</option>
                  <option value={4}>Spock</option>
                  <option value={5}>Lizard</option>
                </select>
              </div>
              <div>
                <input
                  className="inputContainer"
                  type="text"
                  placeholder="Salt"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                />
              </div>
              <button type="submit" id="submitBtn" className="border-2 border-gray-300 p-2 w-full max-w-xs" onClick={solveContract}>Solve</button>
            </div>
          </div>
        </div>
        {/* <DiscoverWalletProviders
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          onSetUserAccountChange={setUserAccount}
          userAccount={userAccount}
          setProvider={setProvider}
          provider={provider}
        /> */}
        {/* <ConnectWallet /> */}
      </QueryClientProvider>
      {/* </WagmiProvider> */}
    </>
  )
}

export default App
