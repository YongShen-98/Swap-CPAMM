import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import {constant_CPAMM_abi, constant_CPAMM_address} from "./ethereum/swapcpamm";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [transactionData, setTransactionData] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const swap = async ()=>{  
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(constant_CPAMM_address,constant_CPAMM_abi,signer)
    const resp = await contract.swap(document.getElementById('address').value, document.getElementById('amount').value);
    setTransactionData(resp.hash);
  }

  const add = async ()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(constant_CPAMM_address,constant_CPAMM_abi,signer)

    const resp = await contract.addLiquidity(document.getElementById('RVT').value, document.getElementById('MTT').value);
    setTransactionData(resp.hash);
  }

  const shares = async ()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(constant_CPAMM_address,constant_CPAMM_abi,signer)
    const resp = await contract.balanceOf(document.getElementById('balance').value);
    alert("shares :"+resp/10**18);
  }
  
  const getreserve0 = async ()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(constant_CPAMM_address,constant_CPAMM_abi,signer)

    const resp = await contract.reserve0()
    
    alert(resp/10**18)
  }  

  const getreserve1 = async ()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(constant_CPAMM_address,constant_CPAMM_abi,signer)

    const resp = await contract.reserve1()
    
    alert(resp/10**18)
  }  

  const compute = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(constant_CPAMM_address,constant_CPAMM_abi,signer)

    await contract.calculateAdd(document.getElementById('computeAddress').value, document.getElementById('computeAmount').value)
  }

  const getresult = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(constant_CPAMM_address,constant_CPAMM_abi,signer)
    const r = await contract.calculateamount()
    alert(r);

  }

  const remove = async ()=>{
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(constant_CPAMM_address,constant_CPAMM_abi,signer)

    await contract.removeLiquidity(document.getElementById('Remove').value)

  }


  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4"></h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Exchange</h1>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-fifths-fifths">
                  <input
                    id = "address"
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your token address for exchange (0x...)"
                  />
                  <input
                    id = "amount"
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your token amount for exchange"
                    defaultValue={'1000000000000000000'}
                  />  
                </div>
              </div>
              <div className="column">
                  <button className="button is-link is-medium" onClick = {swap}>
                    Swap button
                  </button>
                </div>

                <div className="column is-fifths-fifths">
                  <input
                    id = "computeAddress"
                    className="input is-medium"
                    type="text"
                    placeholder="address input"
                  />
                  <input
                    id = "computeAmount"
                    className="input is-medium"
                    type="text"
                    placeholder="amount input"
                  />    
                </div>
                <div className="column">
                  <button className="button is-link is-medium" onClick = {compute}>
                    Compute
                  </button>
                  <button className="button is-link is-medium" style={{ marginLeft: 10 }} onClick = {getresult}>
                    Result
                  </button>
                </div>

              <div className="column is-fifths-fifths">
                  <input
                    id = "RVT"
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your RVT amount for adding liquidity"
                    defaultValue={'1000000000000000000'}
                  />
                  <input
                    id = "MTT"
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your MTT amount for adding liquidity"
                    defaultValue={'1000000000000000000'}
                  />  
                </div>
              <div className="column">
                  <button className="button is-link is-medium" onClick = {add}>
                    Adding button
                  </button>
                </div>
              
              <div className="column is-fifths-fifths">
                  <input
                    id = "balance"
                    className="input is-medium"
                    type="text"
                    placeholder="Checking shares of address input"
                    defaultValue={walletAddress}
                  />  
                </div>
              <div className="column">
                  <button className="button is-link is-medium" onClick = {shares}>  
                    Getting shares
                  </button>
                </div>
          
                <div className="column is-fifths-fifths">
                  <input
                    id = "Remove"
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your shares for removing liquidity"
                    defaultValue={'1000000000000000000'}
                  />  
                </div>
              <div className="column">
                  <button className="button is-link is-medium" onClick = {remove}>
                    Removing button
                  </button>
                </div>
                <div className="columns">
                <div className="column">
                  <button className="button is-link is-medium" onClick = {getreserve0}>
                    RVT 
                  </button>
                  </div>
                <div className="column">
                  <button className="button is-link is-medium" onClick = {getreserve1}>
                    MTT
                  </button>
                </div>
                </div>

              <article className="panel is-grey-darker">
                <p className="panel-heading">Exchange Address</p>
                <div className="panel-block">
                  <p>0xDD6aD4EcEA8fd757085812876FA2B7aA38A1308E
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
