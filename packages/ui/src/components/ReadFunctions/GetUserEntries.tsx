import { useState } from "react";
import { getContract } from "sdk/src/lib/utils";
import Raffle from "sdk/src/abi/contracts/Raffle.sol/Raffle.json";
import { getUserEntries } from "sdk/src/ReadFunctions/getUserEntries";
import "../../styles/main.css";

function GetUserEntries() {
  const [contractAddress, setContractAddress] = useState("");
  const [errorMessage, setErroMessage] = useState("");

  const [userEntries, setUserEntries] = useState("");
  const [user, setUser] = useState("");
  const [raffleId, setRaffleId] = useState("");

  async function handleGetRaffle() {
    setUserEntries("");
    setErroMessage("");
    try {
      const contract = getContract(contractAddress, Raffle);
      getUserEntries(contract, user, raffleId)
        .then((res) => {
          setUserEntries(res.toString());
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
        <h2>Get User Entries</h2>
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
          type="string"
          value={user}
          placeholder="user (address)"
          onChange={(e) => setUser(e.target.value)}
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
        <button onClick={handleGetRaffle}>Get User Entries</button>
      </div>
      <div className="row">
        <p>User Entries: {userEntries}</p>
      </div>
      <div className="row">
        <p>
          Error: <span className="error">{errorMessage}</span>
        </p>
      </div>
    </div>
  );
}

export default GetUserEntries;
