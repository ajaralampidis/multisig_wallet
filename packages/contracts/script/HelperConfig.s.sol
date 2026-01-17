// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address helpToken;
        address problmToken;
        address multiSignatureWalletFactory;
        address uniV2Pool;
    }

    uint32 constant SEPOLIA_CHAIN_ID = 11155111;

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getSepoliaConfig();
        } else {
            activeNetworkConfig = getAnvilConfig();
        }
    }

    function getSepoliaConfig() public pure returns (NetworkConfig memory) {
        // TODO: Replace with real deployed addresses on Sepolia
        return NetworkConfig({
            helpToken: address(0), // e.g. 0xRealHelpAddress
            problmToken: address(0), // e.g. 0xRealProblmAddress
            multiSignatureWalletFactory: address(0), // e.g. 0xRealFactoryAddress
            uniV2Pool: address(0) // e.g. 0xRealPoolAddress
        });
    }

    function getAnvilConfig() public pure returns (NetworkConfig memory) {
        // For Anvil/local, we deploy new ones via separate scripts → return zeros as placeholders
        return NetworkConfig({
            helpToken: address(0),
            problmToken: address(0),
            multiSignatureWalletFactory: address(0),
            uniV2Pool: address(0)
        });
    }
}
