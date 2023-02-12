# Raffle Manager | Chainlink Automation

## I. About

The Raffle contract is a highly configurable proof of concept for a Raffle using Chainlink Automation and VRF. It is capable of creating and resolving raffles on demand utilizing the VRF Direct Funding method and Automations to allow users full control of their own raffle.

## II. Pre-requisites

### 1. Setup Wallet

- Install any wallet to your browser (Metamask, etc.)

### 2. Setup Foundry

- Install foundry

  - Installation instructions [https://book.getfoundry.sh/getting-started/installation](https://book.getfoundry.sh/getting-started/installation)

  - ```bash
    curl -L https://foundry.paradigm.xyz | bash
    ```

- Run anvil

  - ```bash
    anvil
    ```

## III. Local Setup

### 1. Clone repo

```bash

git clone git@github.com:linkpoolio/raffle-chainlink-automation.git

```

### 2. Setup .env file

```bash

# from /root

echo "NETWORK=mainnet" >> .env
echo "RPC_URL=<YOUR_RPC>" >> .env

```

### 3. Install dependencies.

```bash
make install

```

### 4. Deploy contract

```bash

# from /root

make deploy

```

## IV. Run the App

### 1. Run storybook

```bash

# from /root/ui

pnpm storybook

```

### 2. View app

- Open browser at [localhost:9009](localhost:9009)

## V. Testing

### 1. Test Contracts

```bash
# from root
make test-contracts
```

### 2. Check test coverage

```bash
# from root
make coverage
```
