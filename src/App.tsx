import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import DiscoverWalletProviders from './components/DiscoverWalletProviders'
// import { ethers } from 'ethers';
import { RPS_CONTRACT_ABI, RPS_BYTECODE, HASHER_CONTRACT_ABI, HASHER_BYTECODE } from "./configABI"; // Import the CONTRACT_ABI from config.js
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { WagmiProvider, useAccount, useWalletClient } from 'wagmi'
import { Config, account } from './config'
import { Account } from './account'
import { WalletOptions } from './wallet-options'
import { goerli } from 'wagmi/chains'
import {
  http,
  Address,
  Hash,
  TransactionReceipt,
  createPublicClient,
  createWalletClient,
  custom,
  stringify,
  getContractAddress,
  parseEther,
} from 'viem'
import 'viem/window'







import { ethers, keccak256 } from 'ethers';
const queryClient = new QueryClient();

// import { createPublicClient, http } from 'viem'
import { localhost, mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})


// function ConnectWallet() { 
//   const { isConnected } = useAccount() 
//   if (isConnected) return <Account /> 
//   return <WalletOptions /> 
// } 

function App() {
  const [count, setCount] = useState(0)
  const [provider, setProvider] = useState();
  const [network, setNetwork] = useState(null);
  const [contract, setContract] = useState<ethers.Contract>();
  const [contractAddress, setContractAddress] = useState<Address>();
  const [hasherContractAddress, setHasherContractAddress] = useState<Address>();
  const [selectedWallet, setSelectedWallet] = useState<EIP6963ProviderDetail>();
  const [userAccount, setUserAccount] = useState<string>('')
  const [c1, setC1] = useState(0)
  const [c1Hash, setC1Hash] = useState<string>('')
  const [c2, setC2] = useState(0)
  const [salt, setSalt] = useState<string>()
  const [chainId, setChainId] = useState(5);
  // const { data: walletClient } = useWalletClient({ chainId: goerli.id });
  const [account, setAccount] = useState<Address>()

  // Input states
  const [stake1, setStake1] = useState(0);
  const [stake2, setStake2] = useState(0);
  const [player2, setPlayer2] = useState<Address>();
  const [game, setGame] = useState('');


  const publicClient = createPublicClient({
    chain: localhost,
    transport: custom(window.ethereum!),
  })
  const walletClient = createWalletClient({
    chain: localhost,
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

        console.log("HASH: ", hash)
        // setC1Hash(hash)
        const tx = await publicClient.waitForTransactionReceipt({ hash: hash });
        console.log("DEPLOYED CONTRACT ADDRESS: ", tx.contractAddress);
        if (tx.contractAddress != undefined || tx.contractAddress != null) {
          setContractAddress(tx.contractAddress);
        }
      }

    } else {
      window.alert("Please fill in all fields")
    }

  }

  async function callContractFunction(move: number, stake: number) {
    // const provider = ethers.getDefaultProvider("http://localhost:7545");
    // const signer = provider.getSigner();
    // const privateKey = '0x42892e7d28eb64f382695ea2ad9edb169954e58c445d89c0b56e5e9ce29e0bb1';
    // const wallet = new ethers.Wallet(privateKey, provider);
    if (contractAddress != undefined) {
      console.log("FOUND CONTRACT: " + contractAddress);
      // const address = await contract.getAddress();
      // const contract2 = new ethers.Contract(address, CONTRACT_ABI, wallet);


      // Create a new instance of the contract
      // const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, wallet);
      // const signer = new ethers.Wallet(privateKey, provider);
      // const contractRef = new ethers.Contract(contractAddress, RPS_CONTRACT_ABI, signer)
      // console.log("FOUND CONTRACT REF")

      // Call the function
      // if (contractRef != undefined) {
      // const result = await contractRef.play(2, { value: ethers.parseEther("1.5"), gasLimit: 0x502833 });
      // console.log(result);


      //         const hash = await walletClient?.deployContract({
      //   abi: HASHER_CONTRACT_ABI,
      //   bytecode: HASHER_BYTECODE as `0x${string}`,
      //   account: account,
      //   value: parseEther("1.5"),
      //   args: [],
      // });
      // console.log("HASH: ", hash)

      // const addr = getContractAddress({
      //   from: account,
      //   bytecode: HASHER_BYTECODE as `0x${string}`,
      //   opcode: 'CREATE',
      // })
      // const tx = await publicClient.waitForTransactionReceipt({hash: hash});
      const [address] = await walletClient.requestAddresses()


      const { request } = await walletClient.writeContract({
        address: contractAddress,
        account: address,
        abi: RPS_CONTRACT_ABI,
        functionName: 'play',
        args: [c2],
        value: parseEther(stake2.toString()),
      })
      // }
    }
    // const result = await contract.yourFunctionName(arg1, arg2, ...);

    // console.log(result);
  }

  async function solveContract() {
    if (contractAddress != undefined && salt != undefined && c1 != undefined) {
      console.log("FOUND CONTRACT: " + contractAddress);

      const [address] = await walletClient.requestAddresses()


      const { request } = await walletClient.writeContract({
        address: contractAddress,
        account: address,
        abi: RPS_CONTRACT_ABI,
        functionName: 'solve',
        args: [c1, parseInt(salt)],
      })
    }
  }

  async function handleHash() {

    const [address1] = await walletClient.requestAddresses()
    setAccount(address1)
    setHasherContractAddress("0x2dc3a8Af5Cae2DcCD94e075079A14D1c7Cba480A")

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
          <div className="border-2 border-gray-300 p-6 rounded-md">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl mb-4">Create Game</h2>
              <div>
                <input
                  className="border-2 border-gray-300 p-2 mb-2 w-full max-w-xs"
                  type="number"
                  placeholder="Stake"
                  onChange={(e) => setStake1(parseFloat(e.target.value))}
                />
              </div>
              <div>
                <input
                  className="border-2 border-gray-300 p-2 mb-2 w-full max-w-xs"
                  type="text"
                  placeholder="Player 2"
                  onChange={(e) => handleSetPlayer2Address(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="border-2 border-gray-300 p-2 mb-2 w-full max-w-xs"
                  type="text"
                  placeholder="Keccak256(move, salt)"
                  disabled={true}
                  value={c1Hash}
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
                    className="border-2 border-gray-300 p-2 mb-2 w-full max-w-xs"
                    type="text"
                    placeholder="Salt"
                    value={salt}
                    disabled={true}
                  />
                  <button onClick={() => handleRandomSaltSet()}>Random</button>
                </div>
              </div>
              <div>
                <button onClick={() => handleHash()}>Hash(c1, salt)</button>
                {/* <div>Result: {c1Hash}</div> */}
              </div>
              <button type="submit" id="submitBtn" className="border-2 border-gray-300 p-2 w-full max-w-xs" onClick={deployContract}>Submit</button>
            </div>
          </div>
          <div className="border-2 border-gray-300 p-6 rounded-md">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl mb-4">Player 2 Turn</h2>
              <div>
                <input
                  className="border-2 border-gray-300 p-2 mb-2 w-full max-w-xs"
                  type="text"
                  placeholder="Contract Address"
                  onChange={(e) => handleSetContractAddress(e.target.value)}
                />
              </div>
              <div>
                <input
                  className="border-2 border-gray-300 p-2 mb-2 w-full max-w-xs"
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
              <button type="submit" id="submitBtn" className="border-2 border-gray-300 p-2 w-full max-w-xs" onClick={() => callContractFunction(c2, stake2)}>Submit</button>
            </div>
          </div>
          <div className="border-2 border-gray-300 p-6 rounded-md">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl mb-4">Player 1 Solve</h2>
              <div>{"Player 1 Address: " + userAccount}</div>
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
              <div className='inputWithButton'>
                <input
                  className="border-2 border-gray-300 p-2 mb-2 w-full max-w-xs"
                  type="text"
                  placeholder="Salt"
                  value={salt}
                  onChange={(e) => setSalt(parseInt(e.target.value))}
                />
                <button onClick={() => setSalt(Math.floor(Math.random() * Number(ethers.MaxUint256)))}>Random</button>
              </div>
              <button type="submit" id="submitBtn" className="border-2 border-gray-300 p-2 w-full max-w-xs" onClick={solveContract}>Submit</button>
            </div>
          </div>
        </div>
        <DiscoverWalletProviders
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          onSetUserAccountChange={setUserAccount}
          userAccount={userAccount}
          setProvider={setProvider}
          provider={provider}
        />
        {/* <ConnectWallet /> */}
      </QueryClientProvider>
      {/* </WagmiProvider> */}
    </>
  )
}

export default App