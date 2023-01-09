import { useState } from "react";
import { getContract } from "sdk/src/lib/utils";
import Raffle from "sdk/src/abi/contracts/Raffle.sol/Raffle.json";
import { enterRaffle } from "sdk/src/WriteFunctions/enterRaffle";
import "../../styles/main.css";

function EnterRaffle() {
  const [contractAddress, setContractAddress] = useState("");
  const [errorMessage, setErroMessage] = useState("");

  const [raffleId, setRaffleId] = useState("");
  const [entries, setEntries] = useState("");
  const [fee, setFee] = useState("");

  async function handleCreateRaffle() {
    setErroMessage("");
    try {
      const contract = getContract(contractAddress, Raffle);
      enterRaffle(contract, raffleId, entries, fee).catch((error: any) => {
        setErroMessage(error.message);
      });
    } catch (error: any) {
      setErroMessage(error.message);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <h2>Enter Raffle</h2>
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
        <input
          type="number"
          value={raffleId}
          placeholder="raffleId (uint256)"
          onChange={(e) => setRaffleId(e.target.value)}
        />
      </div>
      <div className="row">
        <input
          type="number"
          value={fee}
          placeholder="entries (uint256)"
          onChange={(e) => setEntries(e.target.value)}
        />
      </div>
      <div className="row">
        <input
          type="number"
          value={fee}
          placeholder="fee (uint256)"
          onChange={(e) => setFee(e.target.value)}
        />
      </div>
      <div className="row">
        <button onClick={handleCreateRaffle}>Enter Raffle</button>
      </div>
      <div className="row">
        <p>
          Error: <span className="error">{errorMessage}</span>
        </p>
      </div>
    </div>
  );
}

export default EnterRaffle;
