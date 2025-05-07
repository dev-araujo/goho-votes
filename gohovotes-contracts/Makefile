-include .env
export

.PHONY: build deploy-mainnet

build:
	forge build

deploy-mainnet: build
	@echo "Iniciando deploy do GohoVoting para a Polygon Mainnet..."
	GOHO_TOKEN_ADDRESS=$(GOHO_TOKEN_ADDRESS_MAINNET) forge script script/DeployGohoVoting.s.sol:DeployGohoVotingScript \
		--rpc-url $(RPC_URL_MAINNET) \
		--private-key $(PRIVATE_KEY) \
		--broadcast \
		--verify \
		--etherscan-api-key $(POLYGONSCAN_API_KEY) \
		-vvvv
	@echo "Tentativa de deploy finalizada."