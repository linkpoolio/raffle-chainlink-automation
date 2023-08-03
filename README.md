# Giveaway Manager (Chainlink Automation)

## I. About

The Giveaway contract is a highly configurable proof of concept for a Giveaway using Chainlink Automation and VRF. It is capable of creating and resolving giveaways on demand utilizing the VRF Direct Funding method and Automations to allow users full control of their own giveaway.

## II. Pre-requisites

### 1. Clone repo

```bash
$ git clone git@github.com:linkpoolio/giveaway-chainlink-automation.git
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
export UI_GIVEAWAY_MANAGER_CONTRACT_ADDRESS= # Get from anvil after deploying contract
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

As a creator of a giveaway, the minimum token requirments are needed to ensure that your giveaway is created and finished without issues. All unused LINK token amounts are able to be withdrawn after completion of giveaway.

- 5.1 LINK
  - 0.1 (VRF request)
  - 5 (Automation subscription)

#### 2. Giveaway Status

After picking winners is initiated in the UI, the status of the giveaway is moved to `pending`. Each subsequent block is then checked to see if the VRF request has been finished and winners picked. Once found, the status is automatically moved to `finished`. The winners are then able to be viewed and leftover LINK is able to be withdrawn.

#### 3. Developer Integration for Entering Dynamic Giveaway

The Giveaway contract is able to be integrated with any application that is able to send a transaction to the contract. The user will need to call the `enterGiveaway` function with the following parameters:

- `giveawayId` - The ID of the giveaway that the user is entering
- `entries` - The amount of entries the user is purchasing
- `proof` The merkle proof of the user's entry if the giveaway is permissioned

This is how the UI in this repo calls the `enterGiveaway` function using `wagmi`:

```javascript
export const enterGiveaway = async (params: contracts.EnterGiveawayParams) => {
  try {
    const { id, proof, fee } = params
    const config = await prepareWriteContract({
      address: giveawayManagerContractAddress,
      abi: giveawayManagerABI,
      functionName: 'enterGiveaway',
      overrides: {
        value: ethers.utils.parseEther(fee)
      },
      args: [id, params.entries ? params.entries : 1, proof ? proof : []]
    })
    const data = await writeContract(config)
    return data
  } catch (error: any) {
    throw new Error(`Error entering giveaway: ${error.message}`)
  }
}

export interface EnterGiveawayParams {
  id: number
  entries?: number
  proof?: string[]
  fee: string
}
```
