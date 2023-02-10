-include .env

# setup
install:
	forge install Openzeppelin/openzeppelin-contracts foundry-rs/forge-std smartcontractkit/chainlink

deploy:
	npx hardhat run --network ${NETWORK} scripts/deploy.ts

test-contracts: 
	npx hardhat test

coverage:
	npx hardhat coverage
