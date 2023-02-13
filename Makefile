-include .env

# setup
install:
	forge install Openzeppelin/openzeppelin-contracts foundry-rs/forge-std smartcontractkit/chainlink

deploy:
	npx hardhat run --network ${NETWORK} scripts/deploy.ts

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
