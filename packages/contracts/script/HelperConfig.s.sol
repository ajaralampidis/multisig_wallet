// SPDX-License-Identifier: MIT

pragma solidity ^0.8.31;

import {Script} from "forge-std/Script.sol";
import {MintableERC20} from "../src/MintableERC20.sol";
// import {UniV2Pool} from "../src/UniV2Pool.sol";
import {MultiSignatureWalletFactory} from "../src/MultiSignatureWalletFactory.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address help;
        address problm;
        address multiSignatureWalletFactory;
        // address helpProblemPool;
    }
    uint32 constant SEPOLIA_CHAIN_ID = 11155111;

    // uint256 public constant DEFAULT_ANVIL_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getOrCreateSepoliaConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilConfig();
        }
    }

    /**
     * Since we intend to deploy to Sepolia, we won't need to deploy multiple times
     */
    function getOrCreateSepoliaConfig() public returns (NetworkConfig memory) {
        // UniV2Pool, MultiSignatureWalletFactory, HELP and PROBLM could be deployed already on sepolia
        // 1. We should get or store their addresses somewhere TODO
        // 2. if (we have addresses) { return NetworkConfig({...addresses})}
        // 3. if (we don't have addresses) { deploy whatever needs to be deployed }
        // TODO: remove the code bellow
        vm.startBroadcast();
        MintableERC20 help = new MintableERC20("Help", "HELP", msg.sender, 1000e8);
        MintableERC20 problm = new MintableERC20("Problems", "PROBLM", msg.sender, 1000e8);
        MultiSignatureWalletFactory multiSignatureWalletFactory = new MultiSignatureWalletFactory();
        vm.stopBroadcast();

        return NetworkConfig({
            help: address(help),
            problm: address(problm),
            multiSignatureWalletFactory: address(multiSignatureWalletFactory)
        });
    }

    /**
     * We don care about anvil deployments. We deploy every time.
     */
    function getOrCreateAnvilConfig() public returns (NetworkConfig memory) {
        vm.startBroadcast();
        MintableERC20 help = new MintableERC20("Help", "HELP", msg.sender, 1000e8);
        MintableERC20 problm = new MintableERC20("Problems", "PROBLM", msg.sender, 1000e8);
        MultiSignatureWalletFactory multiSignatureWalletFactory = new MultiSignatureWalletFactory();
        vm.stopBroadcast();

        return NetworkConfig({
            help: address(help),
            problm: address(problm),
            multiSignatureWalletFactory: address(multiSignatureWalletFactory)
        });
    }
}
