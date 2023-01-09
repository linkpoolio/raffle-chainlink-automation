import { useState } from "react";
import { getContract } from "sdk/src/lib/utils";
import Raffle from "sdk/src/abi/contracts/Raffle.sol/Raffle.json";
import { claimPrize } from "sdk/src/WriteFunctions/claimPrize";
import "../../styles/main.css";

function ClaimPrize() {
  const [contractAddress, setContractAddress] = useState("");
  const [errorMessage, setErroMessage] = useState("");

  const [raffleId, setRaffleId] = useState("");

  async function handleClaimPrize() {
    setErroMessage("");
    try {
      const contract = getContract(contractAddress, Raffle);
      claimPrize(contract, raffleId).catch((error: any) => {
        setErroMessage(error.message);
      });
    } catch (error: any) {
      setErroMessage(error.message);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <h2>Claim Prize</h2>
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
        <button onClick={handleClaimPrize}>Claim Prize</button>
      </div>
      <div className="row">
        <p>
          Error: <span className="error">{errorMessage}</span>
        </p>
      </div>
    </div>
  );
}

export default ClaimPrize;
