import { useState } from "react";
import { getContract } from "sdk/src/lib/utils";
import Raffle from "sdk/src/abi/contracts/Raffle.sol/Raffle.json";
import { getRaffle } from "sdk/src/ReadFunctions/getRaffle";
import "../../styles/main.css";

function GetRaffle() {
  const [contractAddress, setContractAddress] = useState("");
  const [errorMessage, setErroMessage] = useState("");

  const [raffle, setRaffle] = useState("");
  const [raffleId, setRaffleId] = useState("");

  async function handleGetRaffle() {
    setRaffle("");
    setErroMessage("");
    try {
      const contract = getContract(contractAddress, Raffle);
      getRaffle(contract, raffleId)
        .then((res) => {
          setRaffle(JSON.stringify(res));
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
        <h2>Get Raffle</h2>
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
        <button onClick={handleGetRaffle}>Get Raffle</button>
      </div>
      <div className="row">
        <p>Raffle: {raffle}</p>
      </div>
      <div className="row">
        <p>
          Error: <span className="error">{errorMessage}</span>
        </p>
      </div>
    </div>
  );
}

export default GetRaffle;
