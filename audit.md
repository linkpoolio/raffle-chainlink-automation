Summary
 - [incorrect-equality](#incorrect-equality) (5 results) (Medium)
 - [calls-loop](#calls-loop) (1 results) (Low)
 - [reentrancy-benign](#reentrancy-benign) (1 results) (Low)
 - [reentrancy-events](#reentrancy-events) (1 results) (Low)
 - [timestamp](#timestamp) (5 results) (Low)
 - [solc-version](#solc-version) (3 results) (Informational)
 - [naming-convention](#naming-convention) (2 results) (Informational)
 - [reentrancy-unlimited-gas](#reentrancy-unlimited-gas) (1 results) (Informational)
## incorrect-equality
Impact: Medium
Confidence: High
 - [ ] ID-0
[Raffle.claimPrize(uint256)](contracts/Raffle.sol#L238-L253) uses a dangerous strict equality:
	- [require(bool,string)(raffles[raffleId].winner == msg.sender,You are not the winner of this raffle)](contracts/Raffle.sol#L243-L246)

contracts/Raffle.sol#L238-L253


 - [ ] ID-1
[Raffle.claimPrize(uint256)](contracts/Raffle.sol#L238-L253) uses a dangerous strict equality:
	- [require(bool,string)(raffles[raffleId].raffleState == RaffleState.FINISHED,Raffle is not finished)](contracts/Raffle.sol#L239-L242)

contracts/Raffle.sol#L238-L253


 - [ ] ID-2
[Raffle.checkUpkeep(bytes)](contracts/Raffle.sol#L255-L273) uses a dangerous strict equality:
	- [raffles[i].raffleState == RaffleState.LIVE](contracts/Raffle.sol#L267)

contracts/Raffle.sol#L255-L273


 - [ ] ID-3
[Raffle.enterRaffle(uint256,uint256)](contracts/Raffle.sol#L153-L166) uses a dangerous strict equality:
	- [require(bool,string)(raffles[raffleId].raffleState == RaffleState.LIVE,Raffle is not live)](contracts/Raffle.sol#L154-L157)

contracts/Raffle.sol#L153-L166


 - [ ] ID-4
[Raffle.getUserEntries(address,uint256)](contracts/Raffle.sol#L343-L360) uses a dangerous strict equality:
	- [raffles[raffleId].contestantsAddresses[i] == user](contracts/Raffle.sol#L354)

contracts/Raffle.sol#L343-L360


## calls-loop
Impact: Low
Confidence: Medium
 - [ ] ID-5
[Raffle.pickWinner(uint256)](contracts/Raffle.sol#L173-L185) has external calls inside a loop: [requestId = COORDINATOR.requestRandomWords(requestConfig.keyHash,requestConfig.subscriptionId,requestConfig.requestConfirmations,requestConfig.callbackGasLimit,1)](contracts/Raffle.sol#L174-L180)

contracts/Raffle.sol#L173-L185


## reentrancy-benign
Impact: Low
Confidence: Medium
 - [ ] ID-6
Reentrancy in [Raffle.pickWinner(uint256)](contracts/Raffle.sol#L173-L185):
	External calls:
	- [requestId = COORDINATOR.requestRandomWords(requestConfig.keyHash,requestConfig.subscriptionId,requestConfig.requestConfirmations,requestConfig.callbackGasLimit,1)](contracts/Raffle.sol#L174-L180)
	State variables written after the call(s):
	- [raffles[raffleId].raffleState = RaffleState.FINISHED](contracts/Raffle.sol#L182)
	- [requestIdToRaffleIndex[requestId] = raffleId](contracts/Raffle.sol#L181)

contracts/Raffle.sol#L173-L185


## reentrancy-events
Impact: Low
Confidence: Medium
 - [ ] ID-7
Reentrancy in [Raffle.pickWinner(uint256)](contracts/Raffle.sol#L173-L185):
	External calls:
	- [requestId = COORDINATOR.requestRandomWords(requestConfig.keyHash,requestConfig.subscriptionId,requestConfig.requestConfirmations,requestConfig.callbackGasLimit,1)](contracts/Raffle.sol#L174-L180)
	Event emitted after the call(s):
	- [RaffleClosed(raffleId,raffles[raffleId].contestantsAddresses)](contracts/Raffle.sol#L184)

contracts/Raffle.sol#L173-L185


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-8
[Raffle.performUpkeep(bytes)](contracts/Raffle.sol#L275-L289) uses timestamp for comparisons
	Dangerous comparisons:
	- [(block.timestamp - raffles[i].startDate) > raffles[i].timeLength](contracts/Raffle.sol#L281-L282)

contracts/Raffle.sol#L275-L289


 - [ ] ID-9
[Raffle.claimPrize(uint256)](contracts/Raffle.sol#L238-L253) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(raffles[raffleId].raffleState == RaffleState.FINISHED,Raffle is not finished)](contracts/Raffle.sol#L239-L242)
	- [require(bool,string)(raffles[raffleId].winner == msg.sender,You are not the winner of this raffle)](contracts/Raffle.sol#L243-L246)

contracts/Raffle.sol#L238-L253


 - [ ] ID-10
[Raffle.getUserEntries(address,uint256)](contracts/Raffle.sol#L343-L360) uses timestamp for comparisons
	Dangerous comparisons:
	- [i < raffles[raffleId].contestantsAddresses.length](contracts/Raffle.sol#L351)
	- [raffles[raffleId].contestantsAddresses[i] == user](contracts/Raffle.sol#L354)

contracts/Raffle.sol#L343-L360


 - [ ] ID-11
[Raffle.checkUpkeep(bytes)](contracts/Raffle.sol#L255-L273) uses timestamp for comparisons
	Dangerous comparisons:
	- [raffles[i].raffleState == RaffleState.LIVE](contracts/Raffle.sol#L267)
	- [upkeepNeeded = (block.timestamp - raffles[i].startDate) > raffles[i].timeLength](contracts/Raffle.sol#L268-L270)

contracts/Raffle.sol#L255-L273


 - [ ] ID-12
[Raffle.enterRaffle(uint256,uint256)](contracts/Raffle.sol#L153-L166) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(raffles[raffleId].raffleState == RaffleState.LIVE,Raffle is not live)](contracts/Raffle.sol#L154-L157)
	- [require(bool,string)(msg.value >= (raffles[raffleId].fee * entries),Not enough ETH to join raffle)](contracts/Raffle.sol#L158-L161)

contracts/Raffle.sol#L153-L166


## solc-version
Impact: Informational
Confidence: High
 - [ ] ID-13
Pragma version[^0.8.0](contracts/test/VRFCoordinatorV2Mock.sol#L2) allows old versions

contracts/test/VRFCoordinatorV2Mock.sol#L2


 - [ ] ID-14
Pragma version[^0.8.17](contracts/Raffle.sol#L2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.16

contracts/Raffle.sol#L2


 - [ ] ID-15
solc-0.8.17 is not recommended for deployment

## naming-convention
Impact: Informational
Confidence: High
 - [ ] ID-16
Function [Raffle._pickRandom(uint256,uint256)](contracts/Raffle.sol#L201-L208) is not in mixedCase

contracts/Raffle.sol#L201-L208


 - [ ] ID-17
Variable [Raffle.COORDINATOR](contracts/Raffle.sol#L16) is not in mixedCase

contracts/Raffle.sol#L16


## reentrancy-unlimited-gas
Impact: Informational
Confidence: Medium
 - [ ] ID-18
Reentrancy in [Raffle.claimPrize(uint256)](contracts/Raffle.sol#L238-L253):
	External calls:
	- [address(msg.sender).transfer(raffles[raffleId].prizeWorth)](contracts/Raffle.sol#L247)
	Event emitted after the call(s):
	- [RafflePrizeClaimed(raffleId,msg.sender,raffles[raffleId].prizeWorth)](contracts/Raffle.sol#L248-L252)

contracts/Raffle.sol#L238-L253


