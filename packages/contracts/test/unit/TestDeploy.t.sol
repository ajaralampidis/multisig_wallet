// SPDX-License-Identifier: MIT
pragma solidity ^0.8.31;

import {Test} from "forge-std/Test.sol";
import {Deploy} from "script/Deploy.s.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {MintableERC20} from "src/MintableERC20.sol";
import {MultiSignatureWalletFactory} from "src/MultiSignatureWalletFactory.sol";
// import {UniV2Pool} from "src/UniV2Pool.sol";

contract TestDeploy is Test {
    Deploy public deployScript;

    HelperConfig public config;
    MintableERC20 public helpToken;
    MintableERC20 public problmToken;
    MultiSignatureWalletFactory public multiSignatureWalletFactory;
    // UniV2Pool public pool;

    // address public deployer;

    function setUp() public {
        deployScript = new Deploy();

        (
            config,
            helpToken,
            problmToken,
            multiSignatureWalletFactory /* , pool */
        ) = deployScript.run();

        // Optional: figure out who would be the deployer (useful for later tests)
        // deployer = address(uint160(uint256(keccak256("deployer")))); // dummy or use vm.addr(1)
    }

    function test_DeployScriptReturnsNonZeroAddresses() public view {
        assertTrue(address(config) != address(0), "HelperConfig not deployed");
        assertTrue(address(helpToken) != address(0), "HELP token not returned");
        assertTrue(address(problmToken) != address(0), "PROBLM token not returned");
        assertTrue(address(multiSignatureWalletFactory) != address(0), "MultiSig factory not returned");
        // assertTrue(address(pool) != address(0), "Pool not returned"); // if added back
    }

    function test_FactoryCanPredictAndDeployClone() public {
        bytes32 salt = keccak256(abi.encodePacked("test-salt-123"));

        // Predict first
        address predicted = multiSignatureWalletFactory.predictDeterministicAddress(salt);

        // Deploy (clone)
        address newMultiSignatureWallet = multiSignatureWalletFactory.createChildDeterministic(salt);
        // Check it matches
        assertEq(newMultiSignatureWallet, predicted);

        // Check it matches against the stored wallets
        address[] memory multiSignatureWallets = multiSignatureWalletFactory.getAllMultiSignatureWallets();
        assertGt(multiSignatureWallets.length, 0, "No wallet deployed");

        address lastMultiSignatureWalletCreated = multiSignatureWallets[multiSignatureWallets.length - 1];
        assertEq(lastMultiSignatureWalletCreated, predicted, "Predicted address doesn't match deployed one");

        assertTrue(lastMultiSignatureWalletCreated.code.length > 0, "Clone has no code");
    }
}
