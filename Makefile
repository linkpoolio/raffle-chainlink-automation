-include .env

# setup
install:
	forge install Openzeppelin/openzeppelin-contracts foundry-rs/forge-std smartcontractkit/chainlink

deploy:
	forge script script/RaffleManager.s.sol:RaffleManagerScript --rpc-url ${GOERLI_RPC_URL} --etherscan-api-key ${ETHERSCAN_KEY} --broadcast --verify -vvvv

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
	remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"
