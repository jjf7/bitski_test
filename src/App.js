import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Bitski } from "bitski";
import Web3 from "web3";

const bitski = new Bitski(
  "a50201b1-ab54-458d-9991-88acf345c8c5",
  "https://login-with-bitski-test.vercel.app/success"
);

const Main = ({ account }) => {
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
        </>
      ) : (
        <p>
          Your Account is: <b>{account}</b>
        </p>
      )}
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
      <Route path="/" exact element={<Main account={account} />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}
