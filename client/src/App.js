import React, { useEffect, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

export default function App() {
  const [storageValue, setStorageValue] = useState(0);
  const [inputValue, setInputValue] = useState(0);
  const [web3State, setWeb3State] = useState({
    web3: null, accounts: null, contract: null
  });

  // on mount, setup basics
  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        setWeb3State({ web3, accounts, contract: instance })
      } catch (error) {
        throw new Error("Failed to load web3, accounts, or contract.", error)
      }
    })()
  }, [])

  // Get initial storage value when connected to web3
  useEffect(() => {
    if (web3State.contract) getContractValue()
  }, [web3State.contract])

  const getContractValue = async () => {
    if (!web3State.contract) {
      throw new Error("Contract missing")
    }

    // Get the value from the contract
    const response = await web3State.contract.methods.get().call();

    setStorageValue(response)
  }

  const setContractValue = async () => {
    if (!web3State.contract || !web3State.accounts[0]) {
      throw new Error("contract or account missing")
    }

    // Stores a given value
    await web3State.contract.methods.set(inputValue).send({ from: web3State.accounts[0] });

    // Get the value from the contract to prove it worked.
    getContractValue()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setContractValue()
  }

  const handleInputChange = (e) => {
    e.preventDefault()
    setInputValue(Number(e.target.value))
  }

  if (!web3State.web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Storage in Solidity!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>The stored value is: {storageValue}</p>

        <form noValidate onSubmit={handleSubmit}>
          <label htmlFor="number">Set a new value
            <br />
            <input type="number" name="number" onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  )
}