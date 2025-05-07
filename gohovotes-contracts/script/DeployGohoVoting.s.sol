// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {GohoVoting} from "../src/GohoVoting.sol";
import {Script, console} from "forge-std/Script.sol";

contract DeployGohoVotingScript is Script {
    address gohoTokenAddress;

    function run() external {
        gohoTokenAddress = vm.envAddress("GOHO_TOKEN_ADDRESS");

        if (gohoTokenAddress == address(0)) {
            if (block.chainid == 137) {
                // Polygon Mainnet ID
                gohoTokenAddress = 0x7B7758077e51Bc1Be499eF9180f82E16019065cD;
            } else {
                revert(
                    "DeployGohoVotingScript: Variavel de ambiente GOHO_TOKEN_ADDRESS nao definida e nenhum valor padrao para o chainId atual."
                );
            }
        }

        require(
            gohoTokenAddress != address(0),
            "DeployGohoVotingScript: Endereco do token GOHO invalido para deploy."
        );

        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        GohoVoting gohoVotingContract = new GohoVoting(gohoTokenAddress);

        vm.stopBroadcast();

        console.log(
            "Contrato GohoVoting implantado em:",
            address(gohoVotingContract)
        );
        console.log("Rede (Chain ID):", block.chainid);
        console.log("Token GOHO usado no construtor:", gohoTokenAddress);
    }
}
