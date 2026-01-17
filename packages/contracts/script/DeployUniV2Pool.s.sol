// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {UniV2Pool} from "src/UniV2Pool.sol";

contract DeployUniV2Pool is Script {
    function run(address helpTokenAddr, address problmTokenAddr) external returns (UniV2Pool pool) {
        uint256 deployerPrivateKey =
            vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying with account:", msg.sender);
        console.log("Chain ID:", block.chainid);

        // Deploy pool
        pool = new UniV2Pool(helpTokenAddr, problmTokenAddr);
        console.log("UniV2Pool deployed at:", address(pool));

        vm.stopBroadcast();
    }
}
