import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CrossmintPayButton } from "@crossmint/client-sdk-react-ui";
import { Bitski } from "bitski";
import Web3 from "web3";
import abi from "./abis/abi.json";

const ADDRESS = "0xDb7091e62a4E53B25443D002460291C47c1Cc45c";

const bitski = new Bitski(
  "a50201b1-ab54-458d-9991-88acf345c8c5",
  "https://login-with-bitski-test.vercel.app/success"
);

const Main = ({ account, handleMetamask }) => {
  return (
    <div>
      <h1>Bitski Login Test JFdeSOUSA</h1>

      {account === undefined ? (
        <>
          <div id="login-bitski"></div>
          <br /> <br />
          <a id="download-mm" href="/" target="_blank">
            Download Metamask
          </a>
          <a onClick={handleMetamask}>Login with Metamask</a>
        </>
      ) : (
        <>
          <p>
            Your Account is: <b>{account}</b>
          </p>
        </>
      )}

      <CrossmintPayButton
        collectionTitle="FAM STARS"
        collectionDescription="FAM STARS Test Deployment"
        collectionPhoto="https://www.crossmint.io/assets/crossmint/logo.png"
        clientId="4ac00ba3-fdd5-4d9a-9941-398c52f7a7ed"
        mintConfig={{
          price: "1.5",
          amount: 1,
        }}
      />
    </div>
  );
};

const Success = () => {
  // connect via oauth to use the wallet (call this from a click handler)
  useEffect(() => {
    Bitski.callback();
  });
  return <div>Logging in...</div>;
};

export default function App() {
  const [account, setAccount] = useState(undefined);

  async function continueToApp(provider) {
    const web3 = new Web3(provider);
    console.log("web3", web3);
    // continue!
    console.log("Accounts", await web3.eth.getAccounts());
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  }

  const handleMetamask = async () => {
    await window.ethereum.enable();
    continueToApp(window.ethereum);
  };

  useEffect(() => {
    window.addEventListener("load", () => {
      const useExistingBtn = document.querySelector("#login-injected");
      const useBitskiBtn = document.querySelector("#login-bitski");
      const downloadMMBtn = document.querySelector("#download-mm");

      // inject bitski connect button
      const connectBtn = bitski.getConnectButton({ container: useBitskiBtn });

      // set bitski post-login callback
      connectBtn.callback = function () {
        continueToApp(bitski.getProvider());
      };

      if (window.ethereum) {
        // Show use existing button
        downloadMMBtn.style.display = "none";
        useExistingBtn.style.display = "block";

        // Add action
        useExistingBtn.addEventListener("click", () => {
          window.ethereum.enable().then(() => {
            continueToApp(window.ethereum);
          });
        });
      }
    });
  });

  return (
    <Routes>
      <Route
        path="/"
        exact
        element={<Main account={account} handleMetamask={handleMetamask} />}
      />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}
