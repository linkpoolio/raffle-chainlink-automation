-include .env

install:
	forge install --no-git Openzeppelin/openzeppelin-contracts foundry-rs/forge-std smartcontractkit/chainlink

# TODO: refactor deploy and deploy-local to intuit the RPC_URL based on environment var for `NETWORK`
deploy:
	forge script script/RaffleManager.s.sol:RaffleManagerScript --rpc-url ${GOERLI_RPC_URL} --etherscan-api-key ${ETHERSCAN_KEY} --broadcast --verify -vvvv

deploy-local:
	forge script script/RaffleManager.s.sol:RaffleManagerScript --rpc-url ${LOCAL_RPC_URL} --etherscan-api-key ${ETHERSCAN_KEY} --broadcast --verify -vvvv

# tests
test-contracts-all:
	forge test -vvvv

test-contracts-offline:
	forge test --no-match-test testFork -vvvv

test-contracts-online:
	forge test --match-test testFork -vvvv

# docs
gen-docs:
	forge doc

run-doc-server:
	forge doc --serve --port 4000

clean:
	rm -rf lib
