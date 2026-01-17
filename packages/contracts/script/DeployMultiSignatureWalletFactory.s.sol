// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MultiSignatureWalletFactory} from "src/MultiSignatureWalletFactory.sol";

contract DeployMultiSignatureWalletFactory is Script {
    function run() external returns (MultiSignatureWalletFactory factory) {
        uint256 deployerPrivateKey =
            vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying with account:", msg.sender);
        console.log("Chain ID:", block.chainid);

        // Deploy factory
        factory = new MultiSignatureWalletFactory();
        console.log("MultiSignatureWalletFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
