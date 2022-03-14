import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Bitski } from "bitski";
import Web3 from "web3";

const bitski = new Bitski(
  "a50201b1-ab54-458d-9991-88acf345c8c5",
  "https://login-with-bitski-test.vercel.app/callback.html"
);

const Main = () => {
  return (
    <div>
      <h1>Bitski Login Test JFdeSOUSA</h1>
      <div id="login-bitski"></div>
      <br /> <br />
      <a id="download-mm" href="/" target="_blank">
        Download Metamask
      </a>{" "}
    </div>
  );
};

const Success = () => {
  // connect via oauth to use the wallet (call this from a click handler)

  const login = async () => {
    await bitski.signIn();
  };
  return (
    <div>
      <h1>Success Login</h1>

      <button onClick={login}>Login now</button>
    </div>
  );
};

export default function App() {
  async function continueToApp(provider) {
    const web3 = new Web3(provider);
    console.log("web3", web3);
    // continue!
    console.log("Accounts", await web3.eth.getAccounts());
  }

  useEffect(() => {
    const provider = bitski.getProvider();
    const web3 = new Web3(provider);

    // public calls are always available
    const network = await web3.eth.getBlockNumber();

    // connect via oauth to use the wallet (call this from a click handler)
    await bitski.signIn();

    // now you can get accounts
    const accounts = await web3.eth.getAccounts();

    console.log("accounts:", accounts)

    // and submit transactions for the user to approve
    
  });

  return (
    <Routes>
      <Route path="/" exact element={<Main />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}
