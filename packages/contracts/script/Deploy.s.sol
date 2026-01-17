// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

import {HelperConfig} from "./HelperConfig.s.sol";
import {MintableERC20} from "../src/MintableERC20.sol";
import {UniV2Pool} from "../src/UniV2Pool.sol";
import {MultiSignatureWalletFactory} from "../src/MultiSignatureWalletFactory.sol";

// Import the dedicated deploy scripts
import {DeployMintableERC20} from "./DeployMintableERC20.s.sol";
import {DeployMultiSignatureWalletFactory} from "./DeployMultiSignatureWalletFactory.s.sol";
import {DeployUniV2Pool} from "./DeployUniV2Pool.s.sol";

contract Deploy is Script {
    function run()
        external
        returns (
            HelperConfig config,
            MintableERC20 helpToken,
            MintableERC20 problmToken,
            MultiSignatureWalletFactory factory,
            UniV2Pool pool
        )
    {
        // Optional: read private key from env (safer than anvil default)
        uint256 deployerKey =
            vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        console.log("Orchestrating deployment with account:", msg.sender);
        console.log("Chain ID:", block.chainid);

        // 1. Get configuration
        config = new HelperConfig();

        (address helpTokenAddr, address problmTokenAddr, address factoryAddr, address poolAddr) =
            config.activeNetworkConfig();

        // 2. Deploy HELP and PROBLM token
        if (helpTokenAddr == address(0) || problmTokenAddr == address(0)) {
            DeployMintableERC20 tokenDeployer = new DeployMintableERC20();
            (helpToken, problmToken) = tokenDeployer.run(); // assumes run() returns both tokens
            console.log("HELP and PROBLM Token deployed via script: ", address(helpToken));
        } else {
            helpToken = MintableERC20(helpTokenAddr);
            console.log("Using existing HELP Token: ", helpTokenAddr);
            problmToken = MintableERC20(problmTokenAddr);
            console.log("Using existing PROBLM Token: ", address(problmToken));
        }

        // 3. Deploy / use MultiSignatureWalletFactory
        if (factoryAddr == address(0)) {
            DeployMultiSignatureWalletFactory factoryDeployer = new DeployMultiSignatureWalletFactory();
            factory = factoryDeployer.run();
            console.log("MultiSignatureWalletFactory deployed via script: ", address(factory));
        } else {
            factory = MultiSignatureWalletFactory(factoryAddr);
            console.log("Using existing MultiSignatureWalletFactory: ", factoryAddr);
        }

        // 5. Deploy / use UniV2Pool
        if (poolAddr == address(0)) {
            DeployUniV2Pool poolDeployer = new DeployUniV2Pool();
            pool = poolDeployer.run(address(helpToken), address(problmToken));
            console.log("UniV2Pool deployed via DeployUniV2Pool: ", address(pool));
        } else {
            pool = UniV2Pool(poolAddr);
            console.log("Using existing UniV2Pool: ", poolAddr);
        }

        console.log("Orchestrated deployment complete!");
        console.log("HelperConfig:       ", address(config));
        console.log("HELP Token:         ", address(helpToken));
        console.log("PROBLM Token:       ", address(problmToken));
        console.log("Factory:            ", address(factory));
        console.log("UniV2Pool:          ", address(pool));

        return (config, helpToken, problmToken, factory, pool);
    }
}
