import { storiesOf } from "@storybook/react";
import GetLiveRaffles from "../src/components/ReadFunctions/GetLiveRaffles";
import GetRaffle from "../src/components/ReadFunctions/GetRaffle";
import CreateRaffle from "../src/components/WriteFunctions/CreateRaffle";
import EnterRaffle from "../src/components/WriteFunctions/EnterRaffle";
import ClaimPrize from "../src/components/WriteFunctions/ClaimPrize";
import GetUserEntries from "../src/components/ReadFunctions/GetUserEntries";
import GetWinners from "../src/components/ReadFunctions/GetWinners";

storiesOf("Raffle", module).add(
  "Create, enter or claim prize from raffles.",
  () => (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <CreateRaffle />
      <EnterRaffle />
      <GetRaffle />
      <GetLiveRaffles />
      <ClaimPrize />
      <GetUserEntries />
      <GetWinners />
    </div>
  )
);
