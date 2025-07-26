-include .env
export

.DEFAULT_GOAL := help

.PHONY: all install clean build test deploy-mainnet deploy-testnet help


all: install build test

install:
	@echo "Foundry: Installing dependencies..."
	@forge install

clean:
	@echo "Foundry: Cleaning build artifacts..."
	@forge clean

build:
	@echo "Foundry: Building contracts..."
	@forge build

test:
	@echo "Foundry: Running tests..."
	@forge test -vvv

# --- DEPLOY ---

deploy-mainnet: build
	@echo "Deploying GohoVoting to Polygon Mainnet..."
	@forge script script/DeployGohoVoting.s.sol:DeployGohoVotingScript \
		--rpc-url $(RPC_URL_MAINNET) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(POLYGONSCAN_API_KEY) \
		--sig "run(address)" $(GOHO_TOKEN_ADDRESS_MAINNET) \
		-vvvv
	@echo "Deployment to Mainnet attempt finished."

deploy-testnet: build
	@echo "Deploying GohoVoting to Polygon Amoy Testnet..."
	@forge script script/DeployGohoVoting.s.sol:DeployGohoVotingScript \
		--rpc-url $(RPC_URL_TESTNET) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(POLYGONSCAN_API_KEY) \
		-vvvv

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Core Targets:"
	@echo "  all              - Runs install, build, and test."
	@echo "  install          - Installs Foundry dependencies."
	@echo "  clean            - Cleans build artifacts."
	@echo "  build            - Builds the contracts."
	@echo "  test             - Runs the tests."
	@echo ""
	@echo "Deployment Targets:"
	@echo "  deploy-mainnet   - Deploys the contract to Polygon Mainnet."
	@echo "  deploy-testnet   - Deploys the contract to Polygon Amoy Testnet."
	@echo ""
	@echo "Help:"
	@echo "  help             - Shows this help message."