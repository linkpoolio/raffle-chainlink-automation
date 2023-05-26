# Raffle Manager (Chainlink Automation)

## I. About

The Raffle contract is a highly configurable proof of concept for a Raffle using Chainlink Automation and VRF. It is capable of creating and resolving raffles on demand utilizing the VRF Direct Funding method and Automations to allow users full control of their own raffle.

## II. Pre-requisites

### 1. Clone repo

```bash
$ git clone git@github.com:linkpoolio/raffle-chainlink-automation.git
```

### 2. Create etherscan API key

- [Create Account](https://docs.etherscan.io/getting-started/creating-an-account)
- [Create API Key](https://docs.etherscan.io/getting-started/viewing-api-usage-statistics)

### 3. Setup contracts environment variables

See `.env.example` This is set in your root directory.

```bash
# Network RPCs
export RPC_URL=

# Private key for contract deployment
export PRIVATE_KEY=

# Explorer API key used to verify contracts
export EXPLORER_KEY=

# From anvil
export LOCAL_RPC_URL="http://localhost:8545"
export ANVIL_PRIVATE_KEY="" # Get from anvil after running for the first time, see below

# UI
export UI_RAFFLE_MANAGER_CONTRACT_ADDRESS= # Get from anvil after deploying contract
export UI_LINK_TOKEN_CONTRACT_ADDRESS=
export UI_KEEPER_REGISTRY_CONTRACT_ADDRESS=
```

### 4. Setup Wallet

Install any wallet to your browser (currently supports Metamask)

## III. Local Setup

## Option 1: Docker

### 1. Start docker

```bash
# <root>
$ docker compose up
```

### 2. View UI

- Open browser at [localhost:3005](localhost:3005)

## Option 2: Manual Setup

### 1. Setup Foundry

[Installation instructions](https://book.getfoundry.sh/getting-started/installation)

```bash
# Download foundry
$ curl -L https://foundry.paradigm.xyz | bash

# Install foundry
$ foundryup

# (Mac only) Install anvil (prereq: Homebrew)
$ brew install libusb
```

### 2. Install contract dependencies if changes have been made to contracts

```bash
# <root>/contracts
$ make install
```

### 3. Run anvil

```bash
# <root>/contracts (run in new terminal window)
$ anvil
```

### 4. Deploy contract

Note: each time anvil is restarted, the contract will need to be re-deployed but will have the same contract address assuming no contract changes

```bash
# <root>/contracts

# If deploying locally
$ make deploy-local

# Or if deploying to public network, set RPC_URL to desired network:
$ make deploy
```

### 5. Install UI dependencies

```bash
# <root>/client
$ nvm use
$ yarn
```

### 6. Run UI

```bash
# <root>/client/packages/ui
$ yarn start
```

### 7. View UI

- Open browser at [localhost:3005](localhost:3005)

## IV. Testing

### 1. Test Contracts

```bash
# <root>/contracts
make test-contracts-all
```

### 2. Test UI

```bash
# <root>/client/packages/ui
$ yarn test
$ yarn tsc
$ yarn lint
$ yarn prettier
```

### 8. Notes

#### 1. Balance Amounts

As a creator of a raffle, the minimum token requirments are needed to ensure that your raffle is created and finished without issues. All unused LINK token amounts are able to be withdrawn after completion of raffle.

- 5.1 LINK
  - 0.1 (VRF request)
  - 5 (Automation subscription)

#### 2. Raffle Status

After picking winners is initiated in the UI, the status of the raffle is moved to `pending`. Each subsequent block is then checked to see if the VRF request has been finished and winners picked. Once found, the status is automatically moved to `finished`. The winners are then able to be viewed and leftover LINK is able to be withdrawn.

#### 3. Helper Functions

To work with both `address` and `string` types for contestant identifiers, identifiers are hashed and formed as `bytes32` to preserve consistency and privacy over both `Dynamic/Static` raffles. To help users who are added into static raffles by the raffle admin find out if they were entered or won, two helper functions have been created.

```solidity
function checkIfWon(uint256 raffleId, string memory user) external view returns (bool)
```

```solidity
function checkIfEntered(uint256 raffleId, string memory user) external view returns (bool)
```

Both helper functions allow for static raffle users to add their unique identifer `(ie. user@protonmail.com)` and raffle ID to check if they were entered or if they have won the raffle without releasing senative information.
