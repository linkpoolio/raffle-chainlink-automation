import { useState } from "react";
import { getContract } from "sdk/src/lib/utils";
import Raffle from "sdk/src/abi/contracts/Raffle.sol/Raffle.json";
import { createRaffle } from "sdk/src/WriteFunctions/createRaffle";
import "../../styles/main.css";

function CreateRaffle() {
  const [contractAddress, setContractAddress] = useState("");
  const [errorMessage, setErroMessage] = useState("");

  const [timeLength, setTimeLength] = useState("");
  const [fee, setFee] = useState("");
  const [name, setName] = useState("");

  async function handleCreateRaffle() {
    setErroMessage("");
    try {
      const contract = getContract(contractAddress, Raffle);
      createRaffle(contract, timeLength, fee, name).catch((error: any) => {
        setErroMessage(error.message);
      });
    } catch (error: any) {
      setErroMessage(error.message);
    }
  }

  return (
    <div className="container">
      <div className="row">
        <h2>Create Raffle</h2>
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
          value={timeLength}
          placeholder="timeLength (uint256)"
          onChange={(e) => setTimeLength(e.target.value)}
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
        <input
          type="string"
          value={name}
          placeholder="name (buytes32)"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="row">
        <button onClick={handleCreateRaffle}>Create Raffle</button>
      </div>
      <div className="row">
        <p>
          Error: <span className="error">{errorMessage}</span>
        </p>
      </div>
    </div>
  );
}

export default CreateRaffle;
