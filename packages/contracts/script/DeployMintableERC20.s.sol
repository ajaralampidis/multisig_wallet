// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MintableERC20} from "src/MintableERC20.sol";

contract DeployMintableERC20 is Script {
    function run() external returns (MintableERC20 helpToken, MintableERC20 problmToken) {
        uint256 deployerPrivateKey =
            vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying with account:", msg.sender);
        console.log("Chain ID:", block.chainid);

        // Deploy HELP token
        helpToken = new MintableERC20("Help", "HELP", msg.sender, 1000e8);
        console.log("HELP Token deployed at:", address(helpToken));

        // Deploy PROBLM token
        problmToken = new MintableERC20("Problems", "PROBLM", msg.sender, 1000e8);
        console.log("PROBLM Token deployed at:", address(problmToken));

        vm.stopBroadcast();
    }
}
