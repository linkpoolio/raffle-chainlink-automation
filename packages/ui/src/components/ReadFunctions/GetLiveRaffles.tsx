import { useState } from "react";
import { getContract } from "sdk/src/lib/utils";
import Raffle from "sdk/src/abi/contracts/Raffle.sol/Raffle.json";
import { getLiveRaffles } from "sdk/src/ReadFunctions/getLiveRaffles";
import "../../styles/main.css";

function GetLiveRaffles() {
  const [contractAddress, setContractAddress] = useState("");
  const [errorMessage, setErroMessage] = useState("");

  const [liveRaffles, setLiveRaffles] = useState("");

  async function handleGetLiveRaffles() {
    setLiveRaffles("");
    setErroMessage("");
    try {
      const contract = getContract(contractAddress, Raffle);
      getLiveRaffles(contract)
        .then((res) => {
          setLiveRaffles(res.join(", "));
        })
        .catch((error: any) => {
          setErroMessage(error.message);
        });
    } catch (error: any) {
      setErroMessage(error.message);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <h2>Get Live Raffles</h2>
      </div>
      <div className="row">
        <input
          type="string"
          value={contractAddress}
          placeholder="contractAddress (address)"
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </div>
      <div className="row">
        <button onClick={handleGetLiveRaffles}>Get Live Raffles</button>
      </div>
      <div className="row">
        <p>Live Raffles: {liveRaffles}</p>
      </div>
      <div className="row">
        <p>
          Error: <span className="error">{errorMessage}</span>
        </p>
      </div>
    </div>
  );
}

export default GetLiveRaffles;
